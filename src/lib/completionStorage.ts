interface DayCompletion {
  sectionKey: string;
  day: number;
  completedAt: string;
}

const STORAGE_KEY_PREFIX = 'cost_day_completion_';

export const completionStorage = {
  // Mark a day as complete
  markDayComplete: (sectionKey: string, day: number): void => {
    const completion: DayCompletion = {
      sectionKey,
      day,
      completedAt: new Date().toISOString(),
    };

    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}_day${day}`;
    localStorage.setItem(storageKey, JSON.stringify(completion));
  },

  // Check if a day is completed
  isDayComplete: (sectionKey: string, day: number): boolean => {
    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}_day${day}`;
    return localStorage.getItem(storageKey) !== null;
  },

  // Get completion details for a day
  getDayCompletion: (sectionKey: string, day: number): DayCompletion | null => {
    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}_day${day}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing day completion:', error);
      return null;
    }
  },

  // Get all completed days for a section
  getCompletedDays: (sectionKey: string): number[] => {
    const completedDays: number[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${STORAGE_KEY_PREFIX}${sectionKey}_day`)) {
        const dayMatch = key.match(/day(\d+)$/);
        if (dayMatch) {
          completedDays.push(parseInt(dayMatch[1]));
        }
      }
    }
    
    return completedDays.sort((a, b) => a - b);
  },

  // Get completion percentage for a section
  getCompletionPercentage: (sectionKey: string, totalDays: number): number => {
    const completedDays = completionStorage.getCompletedDays(sectionKey);
    return totalDays > 0 ? (completedDays.length / totalDays) * 100 : 0;
  },

  // Mark a day as incomplete (remove completion)
  markDayIncomplete: (sectionKey: string, day: number): void => {
    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}_day${day}`;
    localStorage.removeItem(storageKey);
  },

  // Clear all completions for a section
  clearSectionCompletions: (sectionKey: string): void => {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${STORAGE_KEY_PREFIX}${sectionKey}_`)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  // Get all completions across all sections
  getAllCompletions: (): { [sectionKey: string]: number[] } => {
    const completions: { [sectionKey: string]: number[] } = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        try {
          const completion: DayCompletion = JSON.parse(localStorage.getItem(key)!);
          const { sectionKey, day } = completion;
          
          if (!completions[sectionKey]) {
            completions[sectionKey] = [];
          }
          
          completions[sectionKey].push(day);
        } catch (error) {
          console.error('Error parsing completion:', error);
        }
      }
    }
    
    // Sort days for each section
    Object.keys(completions).forEach(sectionKey => {
      completions[sectionKey].sort((a, b) => a - b);
    });
    
    return completions;
  },

  // Clear all completions (for testing/reset)
  clearAllCompletions: (): void => {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};
