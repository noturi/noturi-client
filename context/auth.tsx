import { authTokenCache } from "@/utils/cache";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatarUrl: string;
}

interface AuthContextType {
  // 상태 조회 함수들
  getUser: () => Promise<User | null>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  // 동기적 상태 (내부에서 관리)
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  error: string | null;
  // 토큰 저장 (백엔드에서 받은 토큰을 저장)
  saveAuthTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => Promise<void>;
  // 로그아웃 (토큰 삭제)
  logout: () => Promise<void>;
  // 토큰 갱신
  refreshAccessToken: () => Promise<boolean>;
  // 에러 관리
  clearError: () => void;
  // 상태 변경 알림을 위한 강제 리렌더링
  forceUpdate: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // 강제 리렌더링을 위한 트리거
  const forceUpdate = () => setUpdateTrigger((prev) => prev + 1);

  const clearError = () => setError(null);

  // 저장소에서 사용자 정보 조회
  const getUser = async (): Promise<User | null> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return tokens.user ? JSON.parse(tokens.user) : null;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      return null;
    }
  };

  // 저장소에서 액세스 토큰 조회
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return tokens.accessToken;
    } catch (error) {
      console.error("액세스 토큰 조회 실패:", error);
      return null;
    }
  };

  // 저장소에서 리프레시 토큰 조회
  const getRefreshToken = async (): Promise<string | null> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return tokens.refreshToken;
    } catch (error) {
      console.error("리프레시 토큰 조회 실패:", error);
      return null;
    }
  };

  // 인증 상태 확인 (내부 함수)
  const checkAuthenticationStatus = async (): Promise<boolean> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return !!(tokens.accessToken && tokens.user);
    } catch (error) {
      console.error("인증 상태 확인 실패:", error);
      return false;
    }
  };

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log("🔍 저장된 토큰 확인 중...");
        const authenticated = await checkAuthenticationStatus();

        setIsAuthenticated(authenticated);

        if (authenticated) {
          console.log("✅ 인증 상태 복원 완료");
        } else {
          console.log("❌ 유효한 인증 상태 없음");
        }
      } catch (error) {
        console.error("인증 상태 확인 실패:", error);
        setError("인증 상태 확인에 실패했습니다.");
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // 백엔드에서 받은 토큰들을 저장
  const saveAuthTokens = async (tokens: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => {
    try {
      setError(null);

      await authTokenCache.saveAuthTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: JSON.stringify(tokens.user),
      });

      setIsAuthenticated(true);
      console.log("✅ 토큰 저장 완료");
      forceUpdate(); // 상태 변경 알림
    } catch (error) {
      console.error("토큰 저장 실패:", error);
      setError("토큰 저장에 실패했습니다.");
      throw error;
    }
  };

  // 로그아웃 (토큰 삭제)
  const logout = async () => {
    try {
      setError(null);

      await authTokenCache.clearAuthTokens();

      setIsAuthenticated(false);
      console.log("✅ 로그아웃 완료");
      forceUpdate(); // 상태 변경 알림
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setError("로그아웃에 실패했습니다.");
    }
  };

  // 액세스 토큰 갱신
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const currentRefreshToken = await getRefreshToken();
      if (!currentRefreshToken) return false;

      setError(null);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: currentRefreshToken,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const currentUser = await getUser();

        // 새로운 토큰 저장
        await authTokenCache.saveAuthTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || currentRefreshToken,
          user: JSON.stringify(currentUser),
        });

        console.log("✅ 토큰 갱신 완료");
        setIsAuthenticated(true);
        forceUpdate(); // 상태 변경 알림
        return true;
      } else {
        setError("세션이 만료되었습니다. 다시 로그인해주세요.");
        setIsAuthenticated(false);
        await logout();
        return false;
      }
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      setError("토큰 갱신에 실패했습니다.");
      setIsAuthenticated(false);
      await logout();
      return false;
    }
  };

  const value: AuthContextType = {
    getUser,
    getAccessToken,
    getRefreshToken,
    isAuthenticated,
    isInitialLoading,
    error,
    saveAuthTokens,
    logout,
    refreshAccessToken,
    clearError,
    forceUpdate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
