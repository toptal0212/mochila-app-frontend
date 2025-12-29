// Helper utility functions

/**
 * Calculate age from birthday string
 * @param birthday - Birthday in format YYYY-MM-DD or ISO date string
 * @returns Age in years, or null if birthday is invalid
 */
export const calculateAge = (birthday: string | undefined | null): number | null => {
  if (!birthday) return null;
  
  try {
    const birthDate = new Date(birthday);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      return null;
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};

/**
 * Get display age from member data
 * Tries to use age field first, then calculates from birthday if available
 * @param member - Member object with age and/or birthday field
 * @returns Age number or null
 */
export const getDisplayAge = (member: { age?: number; birthday?: string }): number | null => {
  if (member.age) {
    return member.age;
  }
  
  if (member.birthday) {
    return calculateAge(member.birthday);
  }
  
  return null;
};

