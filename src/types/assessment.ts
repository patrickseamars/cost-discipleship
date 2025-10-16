// Common assessment types
export interface AssessmentItem {
  id: number;
  text: string;
}

export interface AssessmentRating {
  itemId: number;
  rating: number;
}

export interface AssessmentResults {
  totalScore: number;
  averageScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  strongestAreas: { text: string; rating: number }[];
  weakestAreas: { text: string; rating: number }[];
  completedItems: number;
  totalItems: number;
  ratings: { [key: number]: number };
  reflectionAnswers: { [key: number]: string };
}

export interface ComparisonData {
  initial: number;
  final: number;
  text: string;
  improvement: number;
  status: 'improved' | 'declined' | 'maintained';
}

export interface AssessmentProps {
  sectionKey: string;
  sectionTitle: string;
  evaluationItems: AssessmentItem[];
  reflectionPrompts?: AssessmentItem[];
  onComplete?: (results: AssessmentResults) => void;
}