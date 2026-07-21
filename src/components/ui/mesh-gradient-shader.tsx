"use client";

import React, { useEffect, useRef } from "react";

export interface MeshGradientProps {
  /** Animation speed multiplier. Default 10. */
  speed?: number;
  /** Color intensity. Default 2. */
  intensity?: number;
  /** Film grain amount. Default 0.75. */
  grain?: number;
  /** Start-Radius (Vollbild), relativ zur längeren Bildschirmseite. Default 1.4 — deckt jede Bildschirmform ab. */
  startRadius?: number;
  /** End-Radius des pulsierenden Punkts, relativ zur längeren Bildschirmseite. Default 0.075. */
  dotRadius?: number;
  /** Wartezeit (ms) in Vollbild, bevor der Kreis zu schrumpfen beginnt. Default 900. */
  holdMs?: number;
  /** Dauer (ms) der Schrumpf-Animation. Default 2000. */
  shrinkMs?: number;
  /** Pulsier-Amplitude als Anteil von dotRadius. Default 0.15. */
  pulseAmplitude?: number;
  /** Periodendauer (ms) des Pulsierens. Default 3600. */
  pulsePeriodMs?: number;
  /** Überspringt die Schrumpf-Animation und startet direkt im Punkt-Zustand (z. B. prefers-reduced-motion). */
  reduceMotion?: boolean;
  /** Wird einmalig aufgerufen, sobald der Punkt erstmals seine Endgröße erreicht. */
  onSettled?: () => void;
  /** Startet die Rück-Expansion zum Vollbild (z. B. nach Logo-Klick). */
  expanding?: boolean;
  /** Dauer (ms) der Expand-Animation. Default 650. */
  expandMs?: number;
  /** Wird einmalig aufgerufen, sobald der Kreis wieder den Vollbild-Radius erreicht. */
  onExpanded?: () => void;
  /**
   * Füllt die Canvas dauerhaft mit dem Mesh (ohne Schrumpf-/Puls-Maske).
   * Für Buttons und andere feste Flächen.
   */
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";

const FRAG = [
  "precision highp float;",
  "uniform vec2 u_res; uniform float u_time; uniform float u_speed; uniform float u_intensity; uniform float u_grain; uniform float u_radius;",
  "const vec3 C_PRIMARY = vec3(0.345,0.412,0.969);",
  "const vec3 C_ACCENT  = vec3(0.988,0.384,0.294);",
  "const vec3 C_PINK    = vec3(0.969,0.427,0.933);",
  "const vec3 C_MAGENTA = vec3(0.718,0.090,0.686);",
  "const vec3 C_DEEP    = vec3(0.102,0.102,0.369);",
  "float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }",
  "float grain(vec2 uv){ return hash(uv*vec2(1031.0,1973.0)+fract(u_time)); }",
  "void main(){",
  "  vec2 uv = gl_FragCoord.xy/u_res.xy;",
  "  float t = u_time*0.16*u_speed;",
  "  vec2 p0=vec2(0.24+0.18*sin(t*1.1), 0.30+0.14*cos(t*0.9));",
  "  vec2 p1=vec2(0.80+0.14*cos(t*0.8), 0.26+0.16*sin(t*1.2));",
  "  vec2 p2=vec2(0.56+0.20*sin(t*0.7), 0.76+0.12*cos(t*0.85));",
  "  vec2 p3=vec2(0.16+0.15*cos(t*1.3), 0.70+0.13*sin(t*0.75));",
  "  float e=1.9;",
  "  float w0=pow(1.0/(distance(uv,p0)+0.05),e);",
  "  float w1=pow(1.0/(distance(uv,p1)+0.05),e);",
  "  float w2=pow(1.0/(distance(uv,p2)+0.05),e);",
  "  float w3=pow(1.0/(distance(uv,p3)+0.05),e);",
  "  float ws=w0+w1+w2+w3;",
  "  vec3 col=(C_ACCENT*w0 + C_PINK*w1 + C_PRIMARY*w2 + C_MAGENTA*w3)/ws;",
  "  float blueWave = smoothstep(0.22, 0.78, 0.5+0.5*sin(t*0.37+1.7));",
  "  col = mix(col, vec3(1.000,0.549,0.259), (1.0-blueWave*0.7)*0.10*u_intensity*sin(t+uv.x*3.0));",
  "  col = mix(col, vec3(0.06,0.34,0.98), blueWave*0.52*u_intensity);",
  "  col = mix(col, C_DEEP, smoothstep(0.45,1.15,uv.y)*0.16);",
  "  col += (grain(uv)-0.5)*0.04*u_grain;",
  "  float scale = max(u_res.x, u_res.y);",
  "  vec2 c = (gl_FragCoord.xy - 0.5*u_res) / scale;",
  "  float dist = length(c);",
  "  float edge = clamp(u_radius*0.22, 0.006, 0.09);",
  "  float mask = 1.0 - smoothstep(u_radius - edge, u_radius, dist);",
  "  gl_FragColor=vec4(col*mask, mask);",
  "}",
].join("\n");

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function getPulseRadius(
  elapsedMs: number,
  p: {
    startRadius: number;
    dotRadius: number;
    holdMs: number;
    shrinkMs: number;
    pulseAmplitude: number;
    pulsePeriodMs: number;
    reduceMotion: boolean;
  },
): number {
  const hold = p.reduceMotion ? 0 : p.holdMs;
  const shrink = p.reduceMotion ? 1 : p.shrinkMs;
  if (elapsedMs < hold) return p.startRadius;
  if (elapsedMs < hold + shrink) {
    const t = (elapsedMs - hold) / shrink;
    return p.startRadius + (p.dotRadius - p.startRadius) * easeOutCubic(t);
  }
  const tp = ((elapsedMs - hold - shrink) / p.pulsePeriodMs) * Math.PI * 2;
  return p.dotRadius + Math.sin(tp) * p.dotRadius * p.pulseAmplitude;
}

export function MeshGradient({
  speed = 10,
  intensity = 2,
  grain = 0.75,
  startRadius = 1.4,
  dotRadius = 0.075,
  holdMs = 900,
  shrinkMs = 2000,
  pulseAmplitude = 0.15,
  pulsePeriodMs = 3600,
  reduceMotion = false,
  onSettled,
  expanding = false,
  expandMs = 650,
  onExpanded,
  fill = false,
  className,
  style,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paramsRef = useRef({
    speed,
    intensity,
    grain,
    startRadius,
    dotRadius,
    holdMs,
    shrinkMs,
    pulseAmplitude,
    pulsePeriodMs,
    reduceMotion,
    expanding,
    expandMs,
    fill,
  });
  paramsRef.current = {
    speed,
    intensity,
    grain,
    startRadius,
    dotRadius,
    holdMs,
    shrinkMs,
    pulseAmplitude,
    pulsePeriodMs,
    reduceMotion,
    expanding,
    expandMs,
    fill,
  };
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;
  const onExpandedRef = useRef(onExpanded);
  onExpandedRef.current = onExpanded;
  const expandSnapshotRef = useRef<{ startMs: number; fromRadius: number } | null>(null);
  const expandedFiredRef = useRef(false);

  useEffect(() => {
    if (!expanding) {
      expandSnapshotRef.current = null;
      expandedFiredRef.current = false;
    }
  }, [expanding]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
    });
    if (!gl) {
      canvas.style.background = "#5869f7";
      return;
    }

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uSpeed = gl.getUniformLocation(prog, "u_speed");
    const uInt = gl.getUniformLocation(prog, "u_intensity");
    const uGrain = gl.getUniformLocation(prog, "u_grain");
    const uRadius = gl.getUniformLocation(prog, "u_radius");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas!.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas!.clientHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    let settledFired = false;
    let raf = 0;
    function frame() {
      resize();
      gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
      gl!.uniform2f(uRes, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
      const elapsedS = (performance.now() - t0) / 1000;
      gl!.uniform1f(uTime, elapsedS);

      const p = paramsRef.current;
      gl!.uniform1f(uSpeed, p.speed);
      gl!.uniform1f(uInt, p.intensity);
      gl!.uniform1f(uGrain, p.grain);

      const elapsedMs = elapsedS * 1000;
      let radius: number;

      if (p.fill) {
        radius = Math.max(p.startRadius, 2);
      } else if (p.expanding) {
        if (!expandSnapshotRef.current) {
          expandSnapshotRef.current = {
            startMs: elapsedMs,
            fromRadius: getPulseRadius(elapsedMs, p),
          };
        }
        const { startMs, fromRadius } = expandSnapshotRef.current;
        const t = Math.min(1, (elapsedMs - startMs) / p.expandMs);
        radius = fromRadius + (p.startRadius - fromRadius) * easeOutCubic(t);
        if (t >= 1 && !expandedFiredRef.current) {
          expandedFiredRef.current = true;
          onExpandedRef.current?.();
        }
      } else {
        const hold = p.reduceMotion ? 0 : p.holdMs;
        const shrink = p.reduceMotion ? 1 : p.shrinkMs;
        if (elapsedMs < hold) {
          radius = p.startRadius;
        } else if (elapsedMs < hold + shrink) {
          const t = (elapsedMs - hold) / shrink;
          radius = p.startRadius + (p.dotRadius - p.startRadius) * easeOutCubic(t);
        } else {
          radius = getPulseRadius(elapsedMs, p);
          if (!settledFired) {
            settledFired = true;
            onSettledRef.current?.();
          }
        }
      }
      gl!.uniform1f(uRadius, radius);

      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        ...style,
      }}
    />
  );
}

export default MeshGradient;
