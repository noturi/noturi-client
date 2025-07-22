import { authApi } from "./apis";
import { authTokenCache } from "@/utils/cache";

interface RefreshTokenResult {
  success: boolean;
  error?: string;
}

export class AuthService {
  async refreshAccessToken(): Promise<RefreshTokenResult> {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      const currentRefreshToken = tokens.refreshToken;
      
      if (!currentRefreshToken) {
        return { success: false, error: "리프레시 토큰이 없습니다." };
      }

      const response = await authApi.refreshToken({
        refreshToken: currentRefreshToken,
      });

      // 기존 사용자 정보 유지
      const currentUser = tokens.user;
      
      await authTokenCache.saveAuthTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || currentRefreshToken,
        user: currentUser || "",
      });

      console.log("✅ 토큰 갱신 완료");
      return { success: true };

    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      
      // 토큰 갱신 실패 시 모든 토큰 삭제
      await this.clearAuthData();
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "토큰 갱신에 실패했습니다." 
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청
      await authApi.logout();
    } catch (error) {
      console.error("서버 로그아웃 요청 실패:", error);
      // 서버 요청이 실패해도 로컬 토큰은 삭제
    } finally {
      // 로컬 토큰 삭제
      await this.clearAuthData();
      console.log("✅ 로그아웃 완료");
    }
  }

  async validateCurrentToken(): Promise<boolean> {
    try {
      return await authApi.validateToken();
    } catch (error) {
      console.error("토큰 검증 실패:", error);
      return false;
    }
  }

  private async clearAuthData(): Promise<void> {
    await authTokenCache.clearAuthTokens();
  }
}

export const authService = new AuthService();