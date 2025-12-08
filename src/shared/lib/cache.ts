import { Platform } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import Logger from './logger';

export interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  deleteToken: (key: string) => Promise<void>;
  clearAllTokens: () => Promise<void>;
}

const TOKEN_KEYS = ['accessToken', 'refreshToken', 'user'] as const;

const createNativeTokenCache = (): TokenCache => ({
  getToken: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      Logger.error(`토큰 조회 실패 [${key}]:`, error);
      await SecureStore.deleteItemAsync(key).catch(() => {});
      return null;
    }
  },

  saveToken: async (key, token) => {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch (error) {
      Logger.error(`토큰 저장 실패 [${key}]:`, error);
      throw error;
    }
  },

  deleteToken: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      Logger.error(`토큰 삭제 실패 [${key}]:`, error);
      throw error;
    }
  },

  clearAllTokens: async () => {
    try {
      await Promise.all(TOKEN_KEYS.map((key) => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      Logger.error('전체 토큰 삭제 실패:', error);
      throw error;
    }
  },
});

const createWebTokenCache = (): TokenCache => ({
  getToken: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      Logger.error(`토큰 조회 실패 [${key}]:`, error);
      localStorage.removeItem(key);
      return null;
    }
  },

  saveToken: async (key, token) => {
    try {
      localStorage.setItem(key, token);
    } catch (error) {
      Logger.error(`토큰 저장 실패 [${key}]:`, error);
      throw error;
    }
  },

  deleteToken: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      Logger.error(`토큰 삭제 실패 [${key}]:`, error);
      throw error;
    }
  },

  clearAllTokens: async () => {
    try {
      TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      Logger.error('전체 토큰 삭제 실패:', error);
      throw error;
    }
  },
});

export const tokenCache: TokenCache =
  Platform.OS === 'web' ? createWebTokenCache() : createNativeTokenCache();

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: string;
}

export const authTokenCache = {
  saveAuthTokens: async (tokens: AuthTokens) => {
    await Promise.all([
      tokenCache.saveToken('accessToken', tokens.accessToken),
      tokenCache.saveToken('refreshToken', tokens.refreshToken),
      tokenCache.saveToken('user', tokens.user),
    ]);
  },

  getAuthTokens: async () => {
    const [accessToken, refreshToken, user] = await Promise.all([
      tokenCache.getToken('accessToken'),
      tokenCache.getToken('refreshToken'),
      tokenCache.getToken('user'),
    ]);
    return { accessToken, refreshToken, user };
  },

  clearAuthTokens: () => tokenCache.clearAllTokens(),
};
