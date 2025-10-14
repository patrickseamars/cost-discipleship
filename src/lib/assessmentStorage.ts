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
    // Verify that we're not accidentally overwriting the wrong assessment type
    const otherType = assessmentType === 'initial' ? 'final' : 'initial';
    const existingOtherAssessment = assessmentStorage.getAssessment(sectionKey, otherType);
    
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
    
    // Verify the other assessment is still intact after saving
    if (existingOtherAssessment) {
      const checkOtherAssessment = assessmentStorage.getAssessment(sectionKey, otherType);
      if (!checkOtherAssessment || 
          checkOtherAssessment.completedAt !== existingOtherAssessment.completedAt) {
        console.warn('Assessment storage warning: Other assessment may have been corrupted, restoring...');
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${sectionKey}_${otherType}`, 
          JSON.stringify(existingOtherAssessment)
        );
      }
    }
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
  },
  
  // Validate that both assessments have the correct assessment type
  validateAssessments: (sectionKey: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    const initial = assessmentStorage.getAssessment(sectionKey, 'initial');
    const final = assessmentStorage.getAssessment(sectionKey, 'final');
    
    if (initial && initial.assessmentType !== 'initial') {
      issues.push(`Initial assessment has wrong type: ${initial.assessmentType}`);
    }
    
    if (final && final.assessmentType !== 'final') {
      issues.push(`Final assessment has wrong type: ${final.assessmentType}`);
    }
    
    if (initial && final && initial.completedAt === final.completedAt) {
      issues.push('Both assessments have the same completion time - possible duplication');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  },
  
  // Repair corrupted assessments by ensuring correct types
  repairAssessments: (sectionKey: string): boolean => {
    const validation = assessmentStorage.validateAssessments(sectionKey);
    if (validation.valid) return true;
    
    console.warn('Assessment validation failed:', validation.issues);
    
    // Try to repair by reloading from localStorage and fixing types
    const initialKey = `${STORAGE_KEY_PREFIX}${sectionKey}_initial`;
    const finalKey = `${STORAGE_KEY_PREFIX}${sectionKey}_final`;
    
    try {
      const initialStored = localStorage.getItem(initialKey);
      const finalStored = localStorage.getItem(finalKey);
      
      if (initialStored) {
        const initialData = JSON.parse(initialStored);
        if (initialData.assessmentType !== 'initial') {
          initialData.assessmentType = 'initial';
          localStorage.setItem(initialKey, JSON.stringify(initialData));
        }
      }
      
      if (finalStored) {
        const finalData = JSON.parse(finalStored);
        if (finalData.assessmentType !== 'final') {
          finalData.assessmentType = 'final';
          localStorage.setItem(finalKey, JSON.stringify(finalData));
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to repair assessments:', error);
      return false;
    }
  }
};
