import { describe, expect, it } from "vitest";
import { hexToRgb, normalizeHex, parseHexColor } from "./color";

describe("parseHexColor", () => {
  it("normalizes shorthand hex input", () => {
    expect(parseHexColor("#abc")).toEqual({
      kind: "valid",
      normalized: "#AABBCC",
    });
  });

  it("rejects missing hash prefixes", () => {
    expect(parseHexColor("123456")).toEqual({
      kind: "invalid",
      error: "Add a leading # and use #RGB or #RRGGBB.",
    });
  });

  it("rejects alpha hex formats", () => {
    expect(parseHexColor("#11223344")).toEqual({
      kind: "invalid",
      error: "Use opaque hex only. Alpha formats are out of scope in v1.",
    });
  });
});

describe("hex helpers", () => {
  it("keeps long hex uppercase", () => {
    expect(normalizeHex("#a1b2c3")).toBe("#A1B2C3");
  });

  it("returns RGB tuples", () => {
    expect(hexToRgb("#1F2937")).toEqual([31, 41, 55]);
  });
});
