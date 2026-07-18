"""Remove outer white background from robot PNGs.

Preserves light interior panels (head/body). Clears canvas white, limb gaps
(via morphological opening), and anti-aliased white fringe.
"""

from __future__ import annotations

import io
import subprocess
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FILES = ["robot.png", "robot_02.png"]

BG_MIN = 248
BG_CHROMA = 18
LIGHT_MIN = 218
LIGHT_CHROMA = 42


def is_light_wash(r: int, g: int, b: int) -> bool:
    return min(r, g, b) >= LIGHT_MIN and max(r, g, b) - min(r, g, b) <= LIGHT_CHROMA


def load_original(name: str) -> Image.Image:
    data = subprocess.check_output(["git", "show", f"HEAD:public/{name}"])
    return Image.open(io.BytesIO(data)).convert("RGBA")


def unmatte_white(r: int, g: int, b: int) -> tuple[int, int, int, int]:
    mn = min(r, g, b)
    alpha = 1.0 - mn / 255.0
    if alpha < 0.06:
        return (0, 0, 0, 0)
    alpha = min(1.0, alpha * 1.25)

    def channel(c: int) -> int:
        return int(max(0, min(255, round((c / 255.0 - (1.0 - alpha)) / alpha * 255))))

    return (channel(r), channel(g), channel(b), int(round(alpha * 255)))


def erode(mask: np.ndarray) -> np.ndarray:
    out = np.zeros_like(mask)
    out[1:-1, 1:-1] = (
        mask[1:-1, 1:-1]
        & mask[:-2, 1:-1]
        & mask[2:, 1:-1]
        & mask[1:-1, :-2]
        & mask[1:-1, 2:]
    )
    return out


def dilate(mask: np.ndarray) -> np.ndarray:
    out = mask.copy()
    out[1:-1, 1:-1] = (
        mask[1:-1, 1:-1]
        | mask[:-2, 1:-1]
        | mask[2:, 1:-1]
        | mask[1:-1, :-2]
        | mask[1:-1, 2:]
    )
    return out


def clear_gaps_morphological(arr: np.ndarray, min_keep: int = 1000) -> int:
    """Split thin light bridges with opening; drop small light pockets (limb gaps)."""
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3].astype(np.int16)
    mn = rgb.min(axis=2)
    chroma = rgb.max(axis=2) - mn
    light = (alpha > 0) & (mn >= LIGHT_MIN) & (chroma <= LIGHT_CHROMA)

    opened = light.astype(np.uint8)
    for _ in range(2):
        opened = erode(opened)
    for _ in range(2):
        opened = dilate(opened)

    h, w = opened.shape
    labels = np.zeros((h, w), dtype=np.int32)
    sizes: dict[int, int] = {}
    lab = 0
    for y in range(h):
        for x in range(w):
            if opened[y, x] and labels[y, x] == 0:
                lab += 1
                q: deque[tuple[int, int]] = deque([(x, y)])
                labels[y, x] = lab
                n = 0
                while q:
                    cx, cy = q.popleft()
                    n += 1
                    for nx, ny in (
                        (cx - 1, cy),
                        (cx + 1, cy),
                        (cx, cy - 1),
                        (cx, cy + 1),
                    ):
                        if 0 <= nx < w and 0 <= ny < h and opened[ny, nx] and labels[ny, nx] == 0:
                            labels[ny, nx] = lab
                            q.append((nx, ny))
                sizes[lab] = n

    keep = np.zeros_like(opened)
    for lab_i, n in sizes.items():
        if n >= min_keep:
            keep[labels == lab_i] = 1
    for _ in range(3):
        keep = dilate(keep)

    remove = light & (keep == 0)
    cleared = int(remove.sum())
    arr[remove] = (0, 0, 0, 0)
    return cleared


def remove_background(im: Image.Image) -> Image.Image:
    arr = np.array(im)

    # 1) Hard canvas white (outer + trapped pure white)
    rgb = arr[:, :, :3].astype(np.int16)
    mn = rgb.min(axis=2)
    chroma = rgb.max(axis=2) - mn
    hard = (mn >= BG_MIN) & (chroma <= BG_CHROMA)
    arr[hard] = (0, 0, 0, 0)

    # 2) Limb gaps / thin light bridges
    clear_gaps_morphological(arr, min_keep=1000)

    # 3) Edge halo cleanup — collect then apply (no cascading erosion).
    h, w = arr.shape[:2]
    updates: list[tuple[int, int, tuple[int, int, int, int]]] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = (
                int(arr[y, x, 0]),
                int(arr[y, x, 1]),
                int(arr[y, x, 2]),
                int(arr[y, x, 3]),
            )
            if a == 0:
                continue

            near_clear = False
            for nx, ny in (
                (x - 1, y),
                (x + 1, y),
                (x, y - 1),
                (x, y + 1),
                (x - 1, y - 1),
                (x + 1, y - 1),
                (x - 1, y + 1),
                (x + 1, y + 1),
            ):
                if 0 <= nx < w and 0 <= ny < h and arr[ny, nx, 3] == 0:
                    near_clear = True
                    break

            if is_light_wash(r, g, b) and a < 240:
                updates.append((x, y, (0, 0, 0, 0)))
                continue

            if not near_clear:
                continue

            if is_light_wash(r, g, b):
                updates.append((x, y, (0, 0, 0, 0)))
            elif min(r, g, b) >= 180:
                updates.append((x, y, unmatte_white(r, g, b)))

    for x, y, pixel in updates:
        arr[y, x] = pixel

    return Image.fromarray(arr, "RGBA")


def stats(im: Image.Image) -> str:
    arr = np.array(im)
    a = arr[:, :, 3]
    rgb = arr[:, :, :3].astype(np.int16)
    mn = rgb.min(axis=2)
    transparent = int((a == 0).sum())
    semi = int(((a > 0) & (a < 255)).sum())
    opaque = int((a == 255).sum())
    white_opaque = int(((a == 255) & (mn >= 248)).sum())
    body_light = int(((a == 255) & (mn >= 225) & (mn <= 245)).sum())
    body_sample = tuple(int(v) for v in arr[350, 650])
    corners = [tuple(int(v) for v in arr[y, x]) for y, x in ((0, 0), (0, -1), (-1, 0), (-1, -1))]
    return (
        f"t={transparent} semi={semi} op={opaque} "
        f"white_op={white_opaque} body_light_op={body_light} "
        f"corners={corners} body_sample={body_sample}"
    )


def main() -> None:
    out_dir = ROOT / "public"
    for name in FILES:
        src = load_original(name)
        result = remove_background(src)
        dest = out_dir / name
        result.save(dest, format="PNG", optimize=True)
        print(f"{name}: {stats(result)}")
        print(f"  saved {dest} ({dest.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
