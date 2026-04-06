import type { ParsedColor } from "../types";

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const HEX_ALPHA_PATTERN = /^#([0-9a-f]{4}|[0-9a-f]{8})$/i;

export function normalizeHex(raw: string): string {
  const match = raw.match(/^#([0-9a-f]{3})$/i);

  if (!match) {
    return raw.toUpperCase();
  }

  const expanded = match[1]
    .split("")
    .map((char) => `${char}${char}`)
    .join("");

  return `#${expanded.toUpperCase()}`;
}

export function parseHexColor(raw: string): ParsedColor {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return {
      kind: "invalid",
      error: "Enter #RGB or #RRGGBB. Transparency is not supported in v1.",
    };
  }

  if (!trimmed.startsWith("#")) {
    return {
      kind: "invalid",
      error: "Add a leading # and use #RGB or #RRGGBB.",
    };
  }

  if (HEX_ALPHA_PATTERN.test(trimmed)) {
    return {
      kind: "invalid",
      error: "Use opaque hex only. Alpha formats are out of scope in v1.",
    };
  }

  if (!HEX_PATTERN.test(trimmed)) {
    return {
      kind: "invalid",
      error: "Use #RGB or #RRGGBB. Letters must be A-F and digits 0-9.",
    };
  }

  return {
    kind: "valid",
    normalized: normalizeHex(trimmed),
  };
}

export function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex);
  const value = normalized.slice(1);

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}
