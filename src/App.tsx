import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { presets } from "./data/presets";
import { parseHexColor } from "./lib/color";
import { buildAssessment } from "./lib/contrast";
import type { Assessment, Preset } from "./types";

const DEFAULT_PRESET = presets[0];

type PreviewTone = "primary" | "muted";

type PreviewCardProps = {
  title: string;
  eyebrow: string;
  foreground: string;
  background: string;
  tone?: PreviewTone;
  children: ReactNode;
};

function PreviewCard({
  title,
  eyebrow,
  foreground,
  background,
  tone = "primary",
  children,
}: PreviewCardProps) {
  return (
    <article
      className={`preview-card preview-card--${tone}`}
      style={
        {
          "--preview-foreground": foreground,
          "--preview-background": background,
        } as CSSProperties
      }
    >
      <div className="preview-card__eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <div className="preview-card__body">{children}</div>
    </article>
  );
}

function App() {
  const foregroundHintId = useId();
  const backgroundHintId = useId();

  const [foregroundInput, setForegroundInput] = useState(DEFAULT_PRESET.foreground);
  const [backgroundInput, setBackgroundInput] = useState(DEFAULT_PRESET.background);
  const [activePresetId, setActivePresetId] = useState<string | null>(DEFAULT_PRESET.id);
  const [lastValidPair, setLastValidPair] = useState({
    foreground: DEFAULT_PRESET.foreground,
    background: DEFAULT_PRESET.background,
  });

  const parsedForeground = parseHexColor(foregroundInput);
  const parsedBackground = parseHexColor(backgroundInput);
  const inputsAreValid =
    parsedForeground.kind === "valid" && parsedBackground.kind === "valid";

  const currentAssessment = inputsAreValid
    ? buildAssessment(parsedForeground.normalized, parsedBackground.normalized)
    : null;
  const staleAssessment = currentAssessment
    ? null
    : buildAssessment(lastValidPair.foreground, lastValidPair.background);
  const shownAssessment = currentAssessment ?? staleAssessment;
  const previewForeground = inputsAreValid
    ? parsedForeground.normalized
    : lastValidPair.foreground;
  const previewBackground = inputsAreValid
    ? parsedBackground.normalized
    : lastValidPair.background;
  const pickerForeground = parsedForeground.kind === "valid"
    ? parsedForeground.normalized
    : lastValidPair.foreground;
  const pickerBackground = parsedBackground.kind === "valid"
    ? parsedBackground.normalized
    : lastValidPair.background;

  useEffect(() => {
    if (!currentAssessment || parsedForeground.kind !== "valid" || parsedBackground.kind !== "valid") {
      return;
    }

    setLastValidPair({
      foreground: parsedForeground.normalized,
      background: parsedBackground.normalized,
    });
  }, [currentAssessment, parsedBackground, parsedForeground]);

  function clearPresetSelection() {
    setActivePresetId(null);
  }

  function applyPreset(preset: Preset) {
    setForegroundInput(preset.foreground);
    setBackgroundInput(preset.background);
    setActivePresetId(preset.id);
  }

  function handleForegroundTextChange(value: string) {
    setForegroundInput(value.toUpperCase());
    clearPresetSelection();
  }

  function handleBackgroundTextChange(value: string) {
    setBackgroundInput(value.toUpperCase());
    clearPresetSelection();
  }

  function handleSwap() {
    if (!inputsAreValid || parsedForeground.kind !== "valid" || parsedBackground.kind !== "valid") {
      return;
    }

    setForegroundInput(parsedBackground.normalized);
    setBackgroundInput(parsedForeground.normalized);
    clearPresetSelection();
  }

  return (
    <div className="page-shell">
      <div className="page-glow page-glow--left" aria-hidden="true" />
      <div className="page-glow page-glow--right" aria-hidden="true" />
      <main className="app-shell">
        <header className="hero">
          <div>
            <p className="hero__eyebrow">WCAG text contrast evaluator</p>
            <h1>Contrast Workbench</h1>
          </div>
          <p className="hero__copy">
            Evaluate flat foreground and background pairs in the browser. Gradients,
            overlays, images, and transparency are intentionally out of scope.
          </p>
        </header>

        <div className="workbench">
          <section className="panel panel--controls" aria-labelledby="controls-heading">
            <div className="section-heading">
              <p className="section-heading__kicker">Inputs</p>
              <h2 id="controls-heading">Color controls</h2>
            </div>

            <div className="control-card">
              <label className="field-label" htmlFor="foreground-hex">
                Foreground hex
              </label>
              <div className="field-row">
                <input
                  id="foreground-hex"
                  name="foreground"
                  value={foregroundInput}
                  onChange={(event) => handleForegroundTextChange(event.target.value)}
                  aria-invalid={parsedForeground.kind === "invalid"}
                  aria-describedby={parsedForeground.kind === "invalid" ? foregroundHintId : undefined}
                  spellCheck="false"
                  autoComplete="off"
                  inputMode="text"
                  className={parsedForeground.kind === "invalid" ? "text-input text-input--invalid" : "text-input"}
                />
                <input
                  aria-label="Pick foreground color"
                  type="color"
                  value={pickerForeground}
                  onChange={(event) => {
                    setForegroundInput(event.target.value.toUpperCase());
                    clearPresetSelection();
                  }}
                  className="picker-input"
                />
              </div>
              <p
                className={
                  parsedForeground.kind === "invalid"
                    ? "field-help field-help--error"
                    : "field-help"
                }
                id={foregroundHintId}
              >
                {parsedForeground.kind === "invalid"
                  ? parsedForeground.error
                  : "Accepted formats: #RGB and #RRGGBB."}
              </p>
            </div>

            <div className="control-card">
              <label className="field-label" htmlFor="background-hex">
                Background hex
              </label>
              <div className="field-row">
                <input
                  id="background-hex"
                  name="background"
                  value={backgroundInput}
                  onChange={(event) => handleBackgroundTextChange(event.target.value)}
                  aria-invalid={parsedBackground.kind === "invalid"}
                  aria-describedby={parsedBackground.kind === "invalid" ? backgroundHintId : undefined}
                  spellCheck="false"
                  autoComplete="off"
                  inputMode="text"
                  className={parsedBackground.kind === "invalid" ? "text-input text-input--invalid" : "text-input"}
                />
                <input
                  aria-label="Pick background color"
                  type="color"
                  value={pickerBackground}
                  onChange={(event) => {
                    setBackgroundInput(event.target.value.toUpperCase());
                    clearPresetSelection();
                  }}
                  className="picker-input"
                />
              </div>
              <p
                className={
                  parsedBackground.kind === "invalid"
                    ? "field-help field-help--error"
                    : "field-help"
                }
                id={backgroundHintId}
              >
                {parsedBackground.kind === "invalid"
                  ? parsedBackground.error
                  : "Accepted formats: #RGB and #RRGGBB."}
              </p>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="action-button"
                onClick={handleSwap}
                disabled={!inputsAreValid}
              >
                Swap foreground and background colors
              </button>
              <div className="swatch-pair" aria-hidden="true">
                <span style={{ backgroundColor: previewForeground }} />
                <span style={{ backgroundColor: previewBackground }} />
              </div>
            </div>

            <div className="preset-panel">
              <div className="section-heading section-heading--compact">
                <p className="section-heading__kicker">Presets</p>
                <h2>Curated starter pairs</h2>
              </div>
              <div className="preset-list" role="list" aria-label="Preset color pairs">
                {presets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      className={isActive ? "preset-chip preset-chip--active" : "preset-chip"}
                      onClick={() => applyPreset(preset)}
                    >
                      <span className="preset-chip__name">{preset.name}</span>
                      <span className="preset-chip__meta">{preset.expectation}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="results-column">
            <section className="panel panel--results" aria-labelledby="results-heading">
              <div className="section-heading">
                <p className="section-heading__kicker">Assessment</p>
                <h2 id="results-heading">Ratio and compliance</h2>
              </div>

              <div className="ratio-layout">
                <article className="ratio-card">
                  <p className="ratio-card__label">Contrast ratio</p>
                  <p className="ratio-card__value" data-testid="contrast-ratio">
                    {shownAssessment ? shownAssessment.formattedRatio : "Unavailable"}
                  </p>
                  <p className="ratio-card__note">
                    {currentAssessment
                      ? "Calculated with the WCAG relative luminance formula."
                      : "Needs valid colors. Showing the last valid assessment until both fields recover."}
                  </p>
                </article>

                <article className="status-panel">
                  <div className="status-grid" aria-live="polite">
                    {(shownAssessment?.outcomes ?? []).map((outcome) => (
                      <div
                        key={outcome.label}
                        className={
                          currentAssessment
                            ? outcome.passes
                              ? "status-chip status-chip--pass"
                              : "status-chip status-chip--fail"
                            : "status-chip status-chip--unavailable"
                        }
                      >
                        <p className="status-chip__title">{outcome.label}</p>
                        <p className="status-chip__state">
                          {currentAssessment ? (outcome.passes ? "Pass" : "Fail") : "Unavailable"}
                        </p>
                        <p className="status-chip__hint">{outcome.threshold}</p>
                      </div>
                    ))}
                  </div>
                  <p className="status-panel__note">
                    Large-text thresholds apply only to large-scale text, not every preview sample.
                  </p>
                </article>
              </div>
            </section>

            <section className="panel panel--preview" aria-labelledby="preview-heading">
              <div className="section-heading">
                <p className="section-heading__kicker">Live previews</p>
                <h2 id="preview-heading">Context cards</h2>
              </div>
              <div className="preview-grid">
                <PreviewCard
                  title="Heading preview"
                  eyebrow="Display text sample"
                  foreground={previewForeground}
                  background={previewBackground}
                >
                  <h4>Shipping a readable hero matters more than styling around it.</h4>
                </PreviewCard>

                <PreviewCard
                  title="Body copy preview"
                  eyebrow="Reading sample"
                  foreground={previewForeground}
                  background={previewBackground}
                >
                  <p>
                    This paragraph shows how the chosen pair performs across longer copy at a
                    standard reading size.
                  </p>
                </PreviewCard>

                <PreviewCard
                  title="Button preview"
                  eyebrow="Action sample"
                  foreground={previewForeground}
                  background={previewBackground}
                >
                  <button
                    type="button"
                    className="preview-cta"
                    style={{ color: previewForeground, backgroundColor: previewBackground }}
                  >
                    Confirm palette
                  </button>
                </PreviewCard>

                <PreviewCard
                  title="Muted text preview"
                  eyebrow="Supporting text sample"
                  foreground={previewForeground}
                  background={previewBackground}
                  tone="muted"
                >
                  <p>
                    Supporting copy uses the same pair at a quieter scale, which can feel weaker
                    even when the math remains unchanged.
                  </p>
                </PreviewCard>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
