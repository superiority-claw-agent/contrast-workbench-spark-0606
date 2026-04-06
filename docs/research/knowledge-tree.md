# Knowledge Tree -- contrast-workbench-spark-0606

## Executive Research Summary

- WCAG 2.2 contrast thresholds are still the correct baseline for a v1 browser workbench: 4.5:1 for normal text AA, 3:1 for large text AA, 7:1 for normal text AAA, and 4.5:1 for large text AAA.
- Pass-fail logic must use the raw computed contrast ratio, not rounded display values. A shown value like `3.00` can still fail if the underlying value is `2.999`.
- The workbench should stay in opaque sRGB hex for v1. Alpha, gradients, and image backgrounds introduce compositing ambiguity that materially changes contrast outcomes.
- Browser-native color pickers are useful but inconsistent in presentation across browsers and platforms, so the product must treat the hex fields as the canonical input and the picker as a convenience control.
- Recommendation: ship as a static client-side app with a local calculation engine and automated tests. No backend is needed for the approved scope.

## DOK 1-2: Facts and Sources

### Domain Overview

This project sits in the accessibility tooling space for designers, frontend engineers, and content authors who need a fast way to check text/background color contrast before shipping UI. The problem is not just calculating a ratio; it is helping users understand whether a pair passes for different text sizes, previewing how the pair behaves in realistic UI contexts, and preventing false confidence from invalid or ambiguous input.

### Glossary

| Term | Definition |
|------|-----------|
| Contrast ratio | The WCAG formula comparing lighter and darker relative luminance values, expressed from `1:1` to `21:1`. |
| Relative luminance | Normalized brightness value derived from sRGB channel values using the WCAG formula. |
| Normal text | Text that does not qualify as large-scale text under WCAG. |
| Large text | Large-scale text. WCAG guidance commonly maps this to at least 18pt regular or 14pt bold, roughly 24px regular or 18.5px bold. |
| Non-text contrast | WCAG requirement that meaningful UI components and graphics have at least 3:1 contrast against adjacent colors. |
| Opaque hex color | A color expressed without transparency, typically `#RGB` or `#RRGGBB`. |
| Preset palette | A curated starting foreground/background combination a user can apply and then refine. |

### Key Facts

| Fact | Source | Confidence |
|------|--------|-----------|
| WCAG AA requires at least 4.5:1 for normal text and 3:1 for large text. | W3C, Understanding SC 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | High |
| WCAG AAA requires at least 7:1 for normal text and 4.5:1 for large text. | W3C, Understanding SC 1.4.6 Contrast (Enhanced): https://www.w3.org/WAI/GL/UNDERSTANDING-WCAG20/visual-audio-contrast7.html | High |
| Contrast ratios range from `1:1` to `21:1`. | W3C, Understanding SC 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html | High |
| Computed contrast values should not be rounded before pass-fail comparison. | W3C, Understanding SC 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html | High |
| WCAG 2.2 uses the sRGB relative luminance breakpoint `0.04045` in the formula definition. | W3C WCAG relative luminance definition: https://w3c.github.io/wcag/guidelines/relative-luminance.html | High |
| If only one of foreground or background is specified, contrast evaluation is not valid. | W3C, Understanding SC 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | High |
| Browser presentation of `<input type="color">` varies substantially across browsers and platforms. | MDN, `<input type="color">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color | High |
| Modern CSS supports hex values with transparency, but that does not remove the need to define compositing rules before evaluating accessibility. | MDN, `<hex-color>`: https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color | High |

### Technology Landscape

| Option | Pros | Cons | Recommendation |
|--------|------|------|---------------|
| Vanilla TypeScript + Vite | Small runtime, fast build, enough for a single-screen tool | UI state and previews become more manual as polish grows | Maybe |
| React + TypeScript + Vite | Fast iteration, easy state synchronization for inputs/previews, strong test ecosystem | Slightly more client runtime than vanilla | Yes |
| Vue + TypeScript + Vite | Similar benefits to React, also light and productive | Adds framework choice overhead with no repo signal favoring it | Maybe |
| Server-rendered full stack app | Unnecessary for local calculations, presets, and static previews | More complexity, hosting, and testing surface | No |
| Vitest for unit/component tests | Fast local feedback and direct coverage of parser and contrast engine | Browser interaction coverage still needs E2E or browser mode | Yes |
| Playwright for UI flow tests | Strong cross-browser interaction coverage for swap, validation, and responsive states | Heavier than unit tests alone | Yes |

### Constraints

- The approved scope is browser-first and lightweight, so runtime architecture should remain static and client-side.
- v1 should support opaque hex entry plus native color pickers only; alpha, gradients, overlays, and sampled image backgrounds are out of scope.
- The app itself must be accessible, not just the contrast calculator results. Labels, keyboard flow, visible focus, and non-color-only status cues are mandatory.
- Preview cards must not imply legal or design compliance outside their stated context. They preview selected colors on fixed sample content; they do not audit arbitrary pages.
- Invalid input must be recoverable without destroying the last valid assessment state or crashing the UI.

## DOK 3: Insights and Analysis

### Cross-Referenced Insights

The main implementation trap is treating contrast checking as a trivial formula problem. W3C guidance and mature reference tools both show that real user value comes from handling edge cases correctly: large text thresholds, non-rounded comparisons, specified foreground/background pairs, and clear invalid-state guidance. MDN's note that native color input UI varies across user agents means the workbench cannot rely on picker UX consistency. The stable product pattern is therefore: canonical hex text inputs, synchronized picker controls, a pure deterministic contrast engine, and a preview surface that explains outcomes without relying on color alone.

Another important boundary is opacity. Modern browsers and some reference tools let users enter alpha values, but accessible evaluation becomes conditional on what the translucent color is composited over. For a focused v1, rejecting alpha and other non-opaque formats is better than pretending the result is authoritative.

### Competitive / Reference Analysis

| Reference | What They Do Well | What They Miss | Relevance |
|-----------|-------------------|---------------|-----------|
| WebAIM Contrast Checker (`webaim.org/resources/contrastchecker/`) | Fast ratio entry, clear AA/AAA breakdown, familiar reference behavior, supports hex entry and picker | Utility-first UI, limited product-style preview, less emphasis on polished responsive workbench flow | High |
| Stark Contrast Checker (`getstark.co`) | Good workflow framing inside design tooling, useful suggestion pattern, modern product feel | Embedded in larger ecosystem; not a lightweight standalone browser-first workbench | Medium |
| Native browser color input | Low-friction picking and OS familiarity | Inconsistent UI, not enough explanation, no contrast-specific results | Medium |

### Tradeoffs

| Decision | Option A | Option B | Recommendation |
|----------|----------|----------|---------------|
| Supported input formats | Accept all CSS color formats | Accept opaque hex only in v1 | Choose opaque hex only for deterministic behavior and simpler validation |
| Architecture | Client-only SPA | Full stack app with API persistence | Choose client-only SPA; no backend value in approved scope |
| Testing | Unit tests only | Unit tests plus a small E2E suite | Choose both; formula correctness and interaction correctness are separate risks |
| Preview semantics | Artistic freeform mockups | Fixed sample cards with declared text roles | Choose fixed sample cards so pass/fail context stays explicit |
| Stack | Vanilla TS | React + TS | Choose React + TS for faster polished UI iteration unless repo constraints emerge later |

## DOK 4: Spiky POVs

### Rejecting Alpha Is Better Than Pretending To Support It

**Claim:** A v1 contrast tool should refuse semi-transparent input instead of calculating misleading "best guess" ratios.

**Evidence for:** WCAG contrast is defined against specified color pairs in normal usage, and compositing materially changes the effective result. Supporting alpha without a compositing model encourages false confidence.

**Evidence against:** Some existing tools do accept alpha and can be useful for exploratory design workflows.

**Our position:** Reject alpha in the product scope now. If future requirements demand it, add explicit compositing controls and define the math and UX separately.

### A Single Good Screen Beats A Tiny Multi-Page App

**Claim:** This product should be a dense, polished single-screen workbench, not a navigational app.

**Evidence for:** The task is iterative and comparison-heavy. Users need tight input-result-preview loops, especially on mobile where extra navigation adds friction.

**Evidence against:** Separate screens can reduce visual density and simplify implementation.

**Our position:** Build a single responsive workbench with stacked mobile sections and anchored summary blocks. That gives focus without fragmenting the workflow.
