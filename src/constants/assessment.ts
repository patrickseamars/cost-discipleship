// Assessment constants
export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
  LABELS: {
    1: "Never",
    2: "Rarely",
    3: "Sometimes",
    4: "Often", 
    5: "Always"
  }
} as const;

export const ASSESSMENT_TYPES = {
  INITIAL: 'initial',
  FINAL: 'final'
} as const;

export const STORAGE_KEYS = {
  ASSESSMENTS: 'cost_assessment_',
  COMPLETIONS: 'cost_completion_',
  REFLECTIONS: 'reflections_',
  QUESTIONS: 'questions_'
} as const;