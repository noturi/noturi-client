import { Platform } from 'react-native';

import * as SecureStore from 'expo-secure-store';

export interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  deleteToken: (key: string) => Promise<void>;
  clearAllTokens: () => Promise<void>;
}

const createNativeTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`토큰 조회: ${key}`);
        } else {
          console.log(`토큰 없음: ${key}`);
        }
        return item;
      } catch (error) {
        console.error(`토큰 조회 실패 ${key}:`, error);
        await SecureStore.deleteItemAsync(key).catch(() => {});
        return null;
      }
    },

    saveToken: async (key: string, token: string) => {
      try {
        await SecureStore.setItemAsync(key, token);
        console.log(`토큰 저장: ${key}`);
      } catch (error) {
        console.error(`토큰 저장 실패 ${key}:`, error);
        throw error;
      }
    },

    deleteToken: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
        console.log(`토큰 삭제: ${key}`);
      } catch (error) {
        console.error(`토큰 삭제 실패 ${key}:`, error);
        throw error;
      }
    },

    clearAllTokens: async () => {
      const tokenKeys = ['accessToken', 'refreshToken', 'user'];
      try {
        await Promise.all(tokenKeys.map((key) => SecureStore.deleteItemAsync(key)));
        console.log('모든 토큰 삭제 완료');
      } catch (error) {
        console.error('토큰 삭제 실패:', error);
        throw error;
      }
    },
  };
};

const createWebTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          console.log(`🔐 토큰 조회: ${key}`);
        } else {
          console.log(`🔍 토큰 없음: ${key}`);
        }
        return item;
      } catch (error) {
        console.error(`❌ 토큰 조회 실패 ${key}:`, error);
        localStorage.removeItem(key);
        return null;
      }
    },

    saveToken: async (key: string, token: string) => {
      try {
        localStorage.setItem(key, token);
        console.log(`💾 토큰 저장: ${key}`);
      } catch (error) {
        console.error(`❌ 토큰 저장 실패 ${key}:`, error);
        throw error;
      }
    },

    deleteToken: async (key: string) => {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ 토큰 삭제: ${key}`);
      } catch (error) {
        console.error(`❌ 토큰 삭제 실패 ${key}:`, error);
        throw error;
      }
    },

    clearAllTokens: async () => {
      const tokenKeys = ['accessToken', 'refreshToken', 'user'];
      try {
        tokenKeys.forEach((key) => localStorage.removeItem(key));
        console.log('🧹 모든 토큰 삭제 완료');
      } catch (error) {
        console.error('❌ 토큰 삭제 실패:', error);
        throw error;
      }
    },
  };
};

// Native: SecureStore, Web: localStorage
export const tokenCache: TokenCache =
  Platform.OS !== 'web' ? createNativeTokenCache() : createWebTokenCache();

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

// 인증 토큰 전용 헬퍼 함수들
export const authTokenCache = {
  saveAuthTokens: async (tokens: { accessToken: string; refreshToken: string; user: string }) => {
    await Promise.all([
      tokenCache.saveToken(TOKEN_KEYS.ACCESS_TOKEN, tokens.accessToken),
      tokenCache.saveToken(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken),
      tokenCache.saveToken(TOKEN_KEYS.USER, tokens.user),
    ]);
  },

  getAuthTokens: async () => {
    const [accessToken, refreshToken, user] = await Promise.all([
      tokenCache.getToken(TOKEN_KEYS.ACCESS_TOKEN),
      tokenCache.getToken(TOKEN_KEYS.REFRESH_TOKEN),
      tokenCache.getToken(TOKEN_KEYS.USER),
    ]);

    return { accessToken, refreshToken, user };
  },

  clearAuthTokens: () => tokenCache.clearAllTokens(),
};
