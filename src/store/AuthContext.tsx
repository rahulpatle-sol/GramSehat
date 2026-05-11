import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api';
import type { User, ProfileUpdateData, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<AuthResponse>;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: ProfileUpdateData) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await authApi.verifyOtp(phone, otp);
    await AsyncStorage.setItem('authToken', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    return await authApi.sendOtp(phone);
  };

  const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (data: ProfileUpdateData): Promise<User> => {
    const response = await authApi.updateProfile(data);
    const updatedUser: User = { ...user, ...response } as User;
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, sendOtp, logout, updateUser }}>
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