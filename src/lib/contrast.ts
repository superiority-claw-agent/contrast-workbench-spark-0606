import { hexToRgb } from "./color";
import type { Assessment, ContrastOutcome } from "../types";

function srgbChannelToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function getRelativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex);
  return (
    0.2126 * srgbChannelToLinear(red) +
    0.7152 * srgbChannelToLinear(green) +
    0.0722 * srgbChannelToLinear(blue)
  );
}

export function getContrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export function getContrastOutcomes(ratio: number): ContrastOutcome[] {
  return [
    {
      label: "AA normal text",
      threshold: "4.5:1 minimum",
      passes: ratio >= 4.5,
    },
    {
      label: "AA large text",
      threshold: "3:1 minimum",
      passes: ratio >= 3,
    },
    {
      label: "AAA normal text",
      threshold: "7:1 minimum",
      passes: ratio >= 7,
    },
    {
      label: "AAA large text",
      threshold: "4.5:1 minimum",
      passes: ratio >= 4.5,
    },
  ];
}

export function buildAssessment(foreground: string, background: string): Assessment {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    formattedRatio: formatContrastRatio(ratio),
    outcomes: getContrastOutcomes(ratio),
  };
}
