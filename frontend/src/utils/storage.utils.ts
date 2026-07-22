export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUser = (): any | null => {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

export const clearAuth = (): void => {
  removeToken();
  removeUser();
};
