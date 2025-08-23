interface IdentityStatement {
  sectionKey: string;
  sectionTitle: string;
  statement: string;
  completedAt: string;
}

const STORAGE_KEY_PREFIX = 'cost_identity_';

export const identityStorage = {
  // Save an identity statement
  saveIdentityStatement: (sectionKey: string, sectionTitle: string, statement: string): void => {
    const identityData: IdentityStatement = {
      sectionKey,
      sectionTitle,
      statement,
      completedAt: new Date().toISOString(),
    };

    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}`;
    localStorage.setItem(storageKey, JSON.stringify(identityData));
  },

  // Get a saved identity statement
  getIdentityStatement: (sectionKey: string): string | null => {
    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) return null;
    
    try {
      const identityData: IdentityStatement = JSON.parse(stored);
      return identityData.statement;
    } catch (error) {
      console.error('Error parsing identity statement:', error);
      return null;
    }
  },

  // Check if an identity statement exists
  hasIdentityStatement: (sectionKey: string): boolean => {
    return identityStorage.getIdentityStatement(sectionKey) !== null;
  },

  // Get full identity data
  getIdentityData: (sectionKey: string): IdentityStatement | null => {
    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing identity data:', error);
      return null;
    }
  },

  // Get all identity statements
  getAllIdentityStatements: (): { [sectionKey: string]: IdentityStatement } => {
    const statements: { [sectionKey: string]: IdentityStatement } = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        try {
          const identityData: IdentityStatement = JSON.parse(localStorage.getItem(key)!);
          statements[identityData.sectionKey] = identityData;
        } catch (error) {
          console.error('Error parsing identity statement:', error);
        }
      }
    }
    
    return statements;
  },

  // Clear identity statement for a section
  clearIdentityStatement: (sectionKey: string): void => {
    const storageKey = `${STORAGE_KEY_PREFIX}${sectionKey}`;
    localStorage.removeItem(storageKey);
  },

  // Clear all identity statements
  clearAllIdentityStatements: (): void => {
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
