import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, updateProfile as updateProfileApi, changePassword as changePasswordApi } from '../services/auth.service';
import { clearAuth, getToken, getUser, setToken, setUser as setStoredUser } from '../utils/storage.utils';

export type UserRole = 'student' | 'mentor' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  profilePicture?: string;
  bio?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isStudent: boolean;
  isMentor: boolean;
  isAdmin: boolean;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string, role?: string) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  updateProfile: (data: { name?: string; bio?: string }) => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const defaultState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: null,
  isStudent: false,
  isMentor: false,
  isAdmin: false,
  loading: true,
};

export const AuthContext = createContext<AuthContextType>({
  ...defaultState,
  login: async () => { throw new Error('AuthProvider not mounted'); },
  register: async () => { throw new Error('AuthProvider not mounted'); },
  logout: () => {},
  updateUser: () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode; navigate?: ReturnType<typeof useNavigate> }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    const token = getToken();
    const stored = getUser();
    if (token && stored) {
      setState({
        user: stored,
        isAuthenticated: true,
        role: stored.role,
        isStudent: stored.role === 'student',
        isMentor: stored.role === 'mentor',
        isAdmin: stored.role === 'admin',
        loading: false,
      });
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await loginUser({ email, password });
    setToken(data.token);
    setStoredUser(data);
    const authUser: AuthUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      token: data.token,
      profilePicture: data.profilePicture,
    };
    setState({
      user: authUser,
      isAuthenticated: true,
      role: authUser.role,
      isStudent: authUser.role === 'student',
      isMentor: authUser.role === 'mentor',
      isAdmin: authUser.role === 'admin',
      loading: false,
    });
    return authUser;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role?: string): Promise<AuthUser> => {
    const data = await registerUser({ name, email, password, role });
    setToken(data.token);
    setStoredUser(data);
    const authUser: AuthUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      token: data.token,
      profilePicture: data.profilePicture,
    };
    setState({
      user: authUser,
      isAuthenticated: true,
      role: authUser.role,
      isStudent: authUser.role === 'student',
      isMentor: authUser.role === 'mentor',
      isAdmin: authUser.role === 'admin',
      loading: false,
    });
    return authUser;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({
      user: null,
      isAuthenticated: false,
      role: null,
      isStudent: false,
      isMentor: false,
      isAdmin: false,
      loading: false,
    });
  }, []);

  const updateUser = useCallback((updatedData: Partial<AuthUser>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const newUser = { ...prev.user, ...updatedData };
      setStoredUser(newUser);
      return { ...prev, user: newUser };
    });
  }, []);

  const updateProfile = useCallback(async (data: { name?: string; bio?: string }) => {
    const result = await updateProfileApi(data);
    updateUser(result);
    return result;
  }, [updateUser]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await changePasswordApi({ currentPassword, newPassword });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
