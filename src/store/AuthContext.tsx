import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api';
import { apiClient } from '../../app/src/api/client';
import type { User, ProfileUpdateData, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isGuest: boolean;
  googleSignIn: (idToken: string) => Promise<AuthResponse>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: ProfileUpdateData) => Promise<User>;
  exitGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const GUEST_TOKEN = 'guest_mode_active';

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      const guestFlag = await AsyncStorage.getItem('isGuest');
      if (guestFlag === 'true') {
        setIsGuest(true);
      } else if (storedToken && storedUser) {
        apiClient.setToken(storedToken);
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async (idToken: string): Promise<AuthResponse> => {
    const response = await authApi.googleAuth(idToken);
    apiClient.setToken(response.token);
    await AsyncStorage.setItem('authToken', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    await AsyncStorage.removeItem('isGuest');
    setToken(response.token);
    setUser(response.user);
    setIsGuest(false);
    return response;
  };

  const continueAsGuest = async (): Promise<void> => {
    await AsyncStorage.setItem('isGuest', 'true');
    setIsGuest(true);
    setToken(GUEST_TOKEN);
  };

  const logout = async (): Promise<void> => {
    apiClient.clearToken();
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('isGuest');
    setToken(null);
    setUser(null);
    setIsGuest(false);
  };

  const exitGuestMode = (): void => {
    setIsGuest(false);
  };

  const updateUser = async (data: ProfileUpdateData): Promise<User> => {
    const response = await authApi.updateProfile(data);
    const updatedUser: User = { ...user, ...response } as User;
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isGuest, googleSignIn, continueAsGuest, logout, updateUser, exitGuestMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
