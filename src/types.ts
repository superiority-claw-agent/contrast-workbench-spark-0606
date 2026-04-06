export type ContrastOutcome = {
  label: string;
  threshold: string;
  passes: boolean;
};

export type ValidColor = {
  kind: "valid";
  normalized: string;
};

export type InvalidColor = {
  kind: "invalid";
  error: string;
};

export type ParsedColor = ValidColor | InvalidColor;

export type Assessment = {
  ratio: number;
  formattedRatio: string;
  outcomes: ContrastOutcome[];
};

export type Preset = {
  id: string;
  name: string;
  foreground: string;
  background: string;
  expectation: string;
};
