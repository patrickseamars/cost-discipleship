interface AssessmentResults {
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

interface StoredAssessment {
  sectionKey: string;
  sectionTitle: string;
  assessmentType: 'initial' | 'final';
  results: AssessmentResults;
  completedAt: string;
  evaluationItems: string[];
}

const STORAGE_KEY_PREFIX = 'cost_assessment_';

export const assessmentStorage = {
  // Save an assessment
  saveAssessment: (
    sectionKey: string,
    sectionTitle: string,
    assessmentType: 'initial' | 'final',
    results: AssessmentResults,
    evaluationItems: string[]
  ): void => {
    const assessment: StoredAssessment = {
      sectionKey,
      sectionTitle,
      assessmentType,
      results,
      completedAt: new Date().toISOString(),
      evaluationItems
    };

    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}_${assessmentType}`;
    localStorage.setItem(storageKey, JSON.stringify(assessment));
  },

  // Get a specific assessment
  getAssessment: (sectionKey: string, assessmentType: 'initial' | 'final'): StoredAssessment | null => {
    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}_${assessmentType}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored assessment:', error);
      return null;
    }
  },

  // Get both initial and final assessments for comparison
  getAssessmentComparison: (sectionKey: string) => {
    const initial = assessmentStorage.getAssessment(sectionKey, 'initial');
    const final = assessmentStorage.getAssessment(sectionKey, 'final');
    
    return { initial, final };
  },

  // Check if an assessment exists
  hasAssessment: (sectionKey: string, assessmentType: 'initial' | 'final'): boolean => {
    return assessmentStorage.getAssessment(sectionKey, assessmentType) !== null;
  },

  // Get all assessments for a section
  getSectionAssessments: (sectionKey: string) => {
    return {
      initial: assessmentStorage.getAssessment(sectionKey, 'initial'),
      final: assessmentStorage.getAssessment(sectionKey, 'final')
    };
  },

  // Get all stored assessments
  getAllAssessments: (): { [key: string]: { initial?: StoredAssessment; final?: StoredAssessment } } => {
    const assessments: { [key: string]: { initial?: StoredAssessment; final?: StoredAssessment } } = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        try {
          const assessment: StoredAssessment = JSON.parse(localStorage.getItem(key)!);
          const { sectionKey, assessmentType } = assessment;
          
          if (!assessments[sectionKey]) {
            assessments[sectionKey] = {};
          }
          
          assessments[sectionKey][assessmentType] = assessment;
        } catch (error) {
          console.error('Error parsing stored assessment:', error);
        }
      }
    }
    
    return assessments;
  },

  // Clear all assessments (for testing/reset)
  clearAllAssessments: (): void => {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  // Clear assessments for a specific section
  clearSectionAssessments: (sectionKey: string): void => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${sectionKey}_initial`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${sectionKey}_final`);
  }
};
