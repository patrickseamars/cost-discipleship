// Exercise and section types
export interface DailyExercise {
  day: number;
  title: string;
  type: string;
  content?: string;
  reflection_prompts?: string[];
  questions?: string[];
  evaluation_items?: { id: number; text: string }[];
  reflection_prompt?: string;
}

export interface Section {
  key: string;
  name: string;
  title?: string;
  totalDays: number;
  daily_exercises?: DailyExercise[];
}

export interface SectionData {
  [key: string]: {
    title: string;
    daily_exercises: DailyExercise[];
  };
}

export interface ExerciseProps {
  exercise: DailyExercise;
  sectionTitle: string;
  sectionKey: string;
  currentDay: number;
  totalDays: number;
  onPrevDay?: () => void;
  onNextDay?: () => void;
}

export interface SectionProps {
  section: Section;
  sectionKey?: string;
}