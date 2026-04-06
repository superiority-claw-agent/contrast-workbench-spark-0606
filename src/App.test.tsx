import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import App from "./App";

describe("App", () => {
  it("renders the default workbench state", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Contrast Workbench" })).toBeVisible();
    expect(screen.getByDisplayValue("#1F2937")).toBeVisible();
    expect(screen.getByDisplayValue("#F9FAFB")).toBeVisible();
  });

  it("has no baseline accessibility violations", async () => {
    const { container } = render(<App />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
