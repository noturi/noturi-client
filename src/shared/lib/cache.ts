import { Platform } from 'react-native';

import * as SecureStore from 'expo-secure-store';

export interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  deleteToken: (key: string) => Promise<void>;
  clearAllTokens: () => Promise<void>;
}

const TOKEN_KEYS = ['accessToken', 'refreshToken', 'user'] as const;

const createNativeTokenCache = (): TokenCache => ({
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, token) => SecureStore.setItemAsync(key, token),
  deleteToken: (key) => SecureStore.deleteItemAsync(key),
  clearAllTokens: () =>
    Promise.all(TOKEN_KEYS.map((key) => SecureStore.deleteItemAsync(key))).then(() => {}),
});

const createWebTokenCache = (): TokenCache => ({
  getToken: async (key) => localStorage.getItem(key),
  saveToken: async (key, token) => localStorage.setItem(key, token),
  deleteToken: async (key) => localStorage.removeItem(key),
  clearAllTokens: async () => TOKEN_KEYS.forEach((key) => localStorage.removeItem(key)),
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
