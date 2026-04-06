# UX Specification -- contrast-workbench-spark-0606

## UX Intent

The product should feel like a focused accessibility instrument, not a generic form. The fastest path is a single responsive workbench where inputs, ratio results, and previews remain visibly connected. Desktop should support side-by-side evaluation. Mobile should preserve the same information hierarchy through stacked cards without hiding critical status.

## User Flows

### Flow 1: Evaluate A Custom Color Pair

```mermaid
flowchart LR
    A[Open workbench with default passing pair] --> B[Edit foreground or background hex]
    B --> C{Valid opaque hex?}
    C -->|No| D[Show inline guidance and hold neutral or last valid result]
    C -->|Yes| E[Sync native color picker]
    E --> F[Recompute WCAG ratio]
    F --> G[Update AA and AAA status grid]
    G --> H[Refresh preview cards]
```

### Flow 2: Apply Preset Then Fine-Tune

```mermaid
flowchart LR
    A[Open preset tray] --> B[Select preset]
    B --> C[Apply foreground and background]
    C --> D[Show preset as active]
    D --> E[Inspect previews and status]
    E --> F[Edit one color manually]
    F --> G[Clear active preset badge]
    G --> H[Continue with custom pair]
```

### Flow 3: Compare Reverse Usage

```mermaid
flowchart LR
    A[Valid color pair displayed] --> B[Activate swap]
    B --> C[Foreground and background exchange]
    C --> D[Recompute ratio]
    D --> E[Update preview cards and pass-fail states]
    E --> F[User decides which direction works better]
```

## Key Screens

### Screen 1: Desktop Contrast Workbench

**Purpose:** Primary desktop view for evaluating a pair, understanding pass-fail results, and comparing UI previews at the same time.

**Entry points:** Initial page load, reload with default colors, future direct URL entry if added later.

**Key elements:**
- Header with product name and one-sentence scope note.
- Color control panel with foreground/background hex fields, native pickers, and swap action.
- Results panel with ratio, AA/AAA grid, and brief threshold guidance.
- Preset rail with curated starting combinations.
- Preview grid with heading, body, button, and muted text samples.

**States:**
- **Loading:** Minimal shell or skeleton for less than one interaction cycle; no spinner-heavy behavior needed for a static app.
- **Initial:** Default valid pair renders ratio, status grid, and previews immediately.
- **Invalid input:** Inline field guidance appears, invalid field is identified, and assessment area shows neutral or last valid state without pass-fail misinformation.
- **Valid edited state:** Ratio, statuses, and previews update together after each valid change.

**Accessibility notes:**
- Each input must have a visible label, programmatic label, and helper text linked with `aria-describedby` when invalid.
- Swap, preset chips, and any status explanations must be keyboard reachable in logical order.
- Pass and fail states must use text and iconography, not color alone.
- Control boundaries and focus rings must meet non-text contrast expectations.

**Performance notes:**
- All screen behavior is local and synchronous; no loading dependency should block first useful interaction.
- Recalculation should feel instantaneous even during rapid typing.

**Wireframe:**

<div style="max-width:980px; margin:16px 0; border:2px solid #1f2937; border-radius:16px; overflow:hidden; background:#f6efe6; color:#16202a; font-family:Georgia,'Times New Roman',serif">
  <div style="background:linear-gradient(135deg,#16324f,#28536b); color:#f8f5f0; padding:14px 18px; display:flex; justify-content:space-between; align-items:center">
    <b>Contrast Workbench</b>
    <span>WCAG text contrast evaluator</span>
  </div>
  <div style="display:grid; grid-template-columns:320px 1fr; gap:0">
    <div style="padding:18px; border-right:1px solid #d2c6b6; background:#fbf7f1">
      <div style="font-size:13px; text-transform:uppercase; letter-spacing:0.08em; color:#6b4f3a; margin-bottom:10px">Inputs</div>
      <div style="border:1px solid #cdbca8; border-radius:12px; padding:12px; margin-bottom:12px">Foreground<br/>[#1F2937] [picker]</div>
      <div style="border:1px solid #cdbca8; border-radius:12px; padding:12px; margin-bottom:12px">Background<br/>[#F9FAFB] [picker]</div>
      <div style="display:flex; gap:10px; margin-bottom:12px">
        <div style="flex:1; border:1px solid #8f6c4d; border-radius:999px; padding:8px 12px; text-align:center">Swap</div>
        <div style="flex:1; border:1px solid #8f6c4d; border-radius:999px; padding:8px 12px; text-align:center">Reset</div>
      </div>
      <div style="font-size:13px; text-transform:uppercase; letter-spacing:0.08em; color:#6b4f3a; margin:14px 0 10px">Presets</div>
      <div style="display:grid; gap:8px">
        <div style="border:1px solid #cdbca8; border-radius:10px; padding:10px">Ink / Sand</div>
        <div style="border:1px solid #cdbca8; border-radius:10px; padding:10px">Ocean / Mist</div>
        <div style="border:1px solid #cdbca8; border-radius:10px; padding:10px">Warning Example</div>
      </div>
    </div>
    <div style="padding:18px">
      <div style="display:grid; grid-template-columns:220px 1fr; gap:14px; margin-bottom:16px">
        <div style="border:1px solid #cdbca8; border-radius:14px; padding:14px; background:#fffdf9">
          <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#6b4f3a">Ratio</div>
          <div style="font-size:34px; margin-top:8px">12.63:1</div>
        </div>
        <div style="border:1px solid #cdbca8; border-radius:14px; padding:14px; background:#fffdf9">
          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px">
            <div style="border:1px solid #93a27f; border-radius:10px; padding:10px">AA Normal<br/>Pass</div>
            <div style="border:1px solid #93a27f; border-radius:10px; padding:10px">AA Large<br/>Pass</div>
            <div style="border:1px solid #93a27f; border-radius:10px; padding:10px">AAA Normal<br/>Pass</div>
            <div style="border:1px solid #93a27f; border-radius:10px; padding:10px">AAA Large<br/>Pass</div>
          </div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px">
        <div style="border:1px solid #cdbca8; border-radius:14px; padding:16px">Heading preview</div>
        <div style="border:1px solid #cdbca8; border-radius:14px; padding:16px">Body preview</div>
        <div style="border:1px solid #cdbca8; border-radius:14px; padding:16px">Button preview</div>
        <div style="border:1px solid #cdbca8; border-radius:14px; padding:16px">Muted text preview</div>
      </div>
    </div>
  </div>
</div>

Mobile wireframe (375px+):

<div style="max-width:390px; margin:16px 0; border:2px solid #1f2937; border-radius:28px; overflow:hidden; background:#f6efe6; color:#16202a; font-family:Georgia,'Times New Roman',serif">
  <div style="background:linear-gradient(135deg,#16324f,#28536b); color:#f8f5f0; padding:12px 14px">
    <b>Contrast Workbench</b><br/>
    <span style="font-size:12px">WCAG text contrast evaluator</span>
  </div>
  <div style="padding:14px; display:grid; gap:10px">
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Foreground<br/>[#1F2937] [picker]</div>
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Background<br/>[#F9FAFB] [picker]</div>
    <div style="border:1px solid #8f6c4d; border-radius:999px; padding:10px; text-align:center">Swap colors</div>
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Ratio 12.63:1 + AA/AAA chips</div>
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Preset chips</div>
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Heading preview</div>
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Body preview</div>
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Button preview</div>
    <div style="border:1px solid #cdbca8; border-radius:14px; padding:12px">Muted preview</div>
  </div>
</div>

### Screen 2: Validation Assist State

**Purpose:** Make malformed or unsupported input recoverable and obvious without losing user orientation.

**Entry points:** Typing malformed hex, removing the `#`, entering too few or too many digits, or using alpha syntax such as `#RRGGBBAA`.

**Key elements:**
- Inline field error under the affected control.
- Neutral results card with short explanation.
- Preserved preview shell so the layout does not jump.
- Optional "use last valid colors" or reset action if implementation chooses to include it.

**States:**
- **Single invalid field:** Only the affected field shows guidance; the other control remains interactive.
- **Both invalid:** Ratio state becomes neutral and all pass-fail chips are suppressed or marked unavailable.
- **Recovered:** Guidance clears as soon as both values are valid again.

**Accessibility notes:**
- Error text should be announced politely and linked to the field.
- Invalid state cannot be signaled by red styling alone.
- Focus should remain stable while typing; no sudden focus steals on validation.

**Performance notes:**
- Validation occurs inline with no debounce required for short hex fields.
- The UI should not remount major sections during error transitions.

**Wireframe:**

<div style="max-width:860px; margin:16px 0; border:2px solid #7a2e2e; border-radius:16px; overflow:hidden; background:#fff8f5; color:#2e1a17; font-family:Georgia,'Times New Roman',serif">
  <div style="background:#7a2e2e; color:#fff7f2; padding:12px 16px"><b>Input guidance</b></div>
  <div style="padding:16px; display:grid; grid-template-columns:320px 1fr; gap:14px">
    <div>
      <div style="border:1px solid #d38e8e; border-radius:12px; padding:12px; background:#fff">Foreground<br/>[#12Z89Q]</div>
      <div style="font-size:13px; color:#7a2e2e; margin-top:8px">Use `#RGB` or `#RRGGBB`. Transparency is not supported in v1.</div>
    </div>
    <div style="border:1px dashed #d38e8e; border-radius:12px; padding:16px; background:#fff">
      Ratio unavailable until both colors are valid. Last valid preview may remain visible with a clear "stale result" note.
    </div>
  </div>
</div>

Mobile wireframe (375px+):

<div style="max-width:390px; margin:16px 0; border:2px solid #7a2e2e; border-radius:28px; overflow:hidden; background:#fff8f5; color:#2e1a17; font-family:Georgia,'Times New Roman',serif">
  <div style="background:#7a2e2e; color:#fff7f2; padding:12px 14px"><b>Input guidance</b></div>
  <div style="padding:14px; display:grid; gap:10px">
    <div style="border:1px solid #d38e8e; border-radius:14px; padding:12px">Foreground<br/>[#12Z89Q]</div>
    <div style="font-size:13px; color:#7a2e2e">Use `#RGB` or `#RRGGBB`. Transparency is not supported.</div>
    <div style="border:1px dashed #d38e8e; border-radius:14px; padding:12px">Ratio unavailable until both values are valid.</div>
  </div>
</div>

## Interaction Rules

- Hex inputs are canonical. Picker changes update hex fields; invalid freeform text never silently rewrites to another value.
- When a preset is active, its chip is highlighted. Any manual edit clears the active preset state.
- Swap happens only when both current values are valid colors. If implementation allows swap while invalid, it must preserve field contents exactly and not fabricate a ratio.
- Preview cards use the selected pair consistently, but muted/supporting text may intentionally apply reduced type size to demonstrate why the same pair can feel weaker in practice.

## Content Rules

- Result labels must say `Pass`, `Fail`, or `Unavailable`; avoid ambiguous copy like `Good` or `Weak`.
- Guidance copy should explain the supported formats in one line.
- The page should include a compact note that the workbench evaluates flat foreground/background text contrast, not gradients, images, or overlays.
