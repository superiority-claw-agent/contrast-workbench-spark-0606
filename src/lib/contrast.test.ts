import { describe, expect, it } from "vitest";
import {
  buildAssessment,
  formatContrastRatio,
  getContrastOutcomes,
  getContrastRatio,
} from "./contrast";

describe("contrast math", () => {
  it("matches the WCAG maximum ratio for black on white", () => {
    expect(getContrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 12);
    expect(buildAssessment("#000000", "#FFFFFF").formattedRatio).toBe("21.00:1");
  });

  it("formats to two decimals without changing comparison logic", () => {
    expect(formatContrastRatio(4.499)).toBe("4.50:1");
    const outcomes = getContrastOutcomes(4.499);
    expect(outcomes[0].passes).toBe(false);
    expect(outcomes[3].passes).toBe(false);
  });

  it("marks a low-contrast pair as failing normal text", () => {
    const assessment = buildAssessment("#F4A261", "#FFF6E8");
    expect(assessment.ratio).toBeLessThan(3);
    expect(assessment.outcomes[0].passes).toBe(false);
    expect(assessment.outcomes[1].passes).toBe(false);
  });
});
