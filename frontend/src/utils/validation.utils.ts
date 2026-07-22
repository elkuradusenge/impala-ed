export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

export const validateRequired = (value: string, fieldName: string): { valid: boolean; message: string } => {
  if (!value || !value.trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};
