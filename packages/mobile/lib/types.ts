export interface DosageTable {
  title: string;
  threshold: string;
  light: string;
  common: string;
  strong: string;
  heavy: string;
}

export interface DurationChart {
  total: string;
  onset: string;
  coming_up: string;
  plateau: string;
  coming_down: string;
}

export interface PsychData {
  title: string;
  image_caption: string;
  family_members?: string[];
  positive_effects: string;
  negative_effects: string;
  neutral_effects: string;
  dosage_table: DosageTable;
  duration_chart_title: string;
  duration_chart: DurationChart;
}

export interface PsychEntry {
  id: string;
  slug: string;
  data: PsychData;
}

export interface ComboEntry {
  slug: string;
  body: string;
}
