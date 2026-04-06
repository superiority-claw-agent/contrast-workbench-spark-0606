import type { Preset } from "../types";

export const presets: Preset[] = [
  {
    id: "ink-sand",
    name: "Ink / Sand",
    foreground: "#1F2937",
    background: "#F9FAFB",
    expectation: "AAA across normal and large text",
  },
  {
    id: "ocean-mist",
    name: "Ocean / Mist",
    foreground: "#16324F",
    background: "#E6F1F5",
    expectation: "Strong editorial contrast",
  },
  {
    id: "evergreen-cream",
    name: "Evergreen / Cream",
    foreground: "#1E4D3A",
    background: "#FBF4E8",
    expectation: "Comfortable reading pair",
  },
  {
    id: "soft-warning",
    name: "Warning Example",
    foreground: "#F4A261",
    background: "#FFF6E8",
    expectation: "Intentional fail for comparison",
  },
];
