import { assessmentStorage } from '@/lib/assessmentStorage';

export const debugAssessments = () => {
  console.log('=== ASSESSMENT DEBUG ===');
  
  // Get all assessments
  const all = assessmentStorage.getAllAssessments();
  console.log('All stored assessments:', all);
  
  // Check localStorage directly
  console.log('=== RAW LOCALSTORAGE ===');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('cost_assessment_')) {
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value);
    }
  }
  
  return all;
};

// Add to window for easy debugging in console
if (typeof window !== 'undefined') {
  (window as any).debugAssessments = debugAssessments;
}