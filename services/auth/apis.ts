import { KyInstance } from 'ky';

import { api } from '../api';
import {
  GoogleLoginDto,
  LoginResponseDto,
  LogoutDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './types';

export class AuthApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // Google 네이티브 로그인
  async googleLogin(data: GoogleLoginDto): Promise<LoginResponseDto> {
    try {
      const response = await this.api.post('auth/google/native', {
        json: data,
      });
      return response.json<LoginResponseDto>();
    } catch (error) {
      console.error('Google login API error:', error);
      throw new Error('Google 로그인에 실패했습니다.');
    }
  }

  // 토큰 새로고침
  async refreshToken(data: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    try {
      const response = await this.api.post('auth/refresh', {
        json: data,
      });
      return response.json<RefreshTokenResponseDto>();
    } catch (error) {
      console.error('Token refresh API error:', error);
      throw new Error('토큰 새로고침에 실패했습니다.');
    }
  }

  // 로그아웃 (서버에서 토큰 무효화)
  async logout(data: LogoutDto): Promise<{ message: string }> {
    try {
      const response = await this.api.post('auth/logout', {
        json: data,
      });
      return response.json<{ message: string }>();
    } catch (error) {
      console.error('Logout API error:', error);
      // 로그아웃은 실패해도 처리 필요
      throw new Error('로그아웃에 실패했습니다.');
    }
  }

  // 토큰 유효성 검증
  async validateToken(): Promise<boolean> {
    try {
      await this.api.get('auth/validate');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const authApi = new AuthApi(api);
