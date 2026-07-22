import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * useAuth - Access authentication state and methods.
 *
 * Must be used inside an <AuthProvider>.
 *
 * Returns:
 * - user, role, isAuthenticated, isStudent, isMentor, isAdmin, loading
 * - login(email, password), register(name, email, password, role?)
 * - logout(), updateUser(), updateProfile(), changePassword()
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
