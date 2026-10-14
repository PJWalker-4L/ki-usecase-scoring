import { describe, expect, it } from "vitest";
import {
  MAX_ANALYSES_PER_BROWSER,
  readUsageCount,
  USAGE_COOKIE_NAME,
  usageCountAfterSuccessfulBeispiele,
} from "./usage-quota";

describe("readUsageCount", () => {
  it("liest den Zähler aus dem Cookie-Header", () => {
    expect(
      readUsageCount(`other=1; ${USAGE_COOKIE_NAME}=1; theme=dark`)
    ).toBe(1);
  });

  it("ignoriert ungültige Werte", () => {
    expect(readUsageCount(`${USAGE_COOKIE_NAME}=abc`)).toBe(0);
  });

  it("begrenzt auf MAX", () => {
    expect(readUsageCount(`${USAGE_COOKIE_NAME}=99`)).toBe(MAX_ANALYSES_PER_BROWSER);
  });
});

describe("usageCountAfterSuccessfulBeispiele", () => {
  it("erhöht bis zum Maximum", () => {
    expect(usageCountAfterSuccessfulBeispiele(0)).toBe(1);
    expect(usageCountAfterSuccessfulBeispiele(1)).toBe(2);
    expect(usageCountAfterSuccessfulBeispiele(2)).toBe(2);
  });
});
