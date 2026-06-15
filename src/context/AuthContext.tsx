import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { User } from '../types';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

const AUTH_STORAGE_KEY = '@mysportitens:user';

interface AuthContextData {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    await AsyncStorage.removeItem('@mysportitens:token');
    setUser(null);
  }, []);

  // Load saved user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();

    const subscription = DeviceEventEmitter.addListener('onTokenExpired', () => {
      logout();
    });

    return () => {
      subscription.remove();
    };
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiLogin({ email, password });
    const userData: User = {
      name: response.user?.name ?? email.split('@')[0],
      email: response.user?.email ?? email,
      code: response.user?.id ?? response.id ?? email,
    };
    
    if (response.access_token) {
      await AsyncStorage.setItem('@mysportitens:token', response.access_token);
    }
    
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await apiRegister({ name, email, password });
    
    // Faz login automaticamente após o registro para obter o token
    await login(email, password);
  }, [login]);


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
