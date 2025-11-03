import { KyInstance } from 'ky';
import {
  AppleLoginDto,
  GoogleLoginDto,
  LoginResponseDto,
  LogoutDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from '~/entities/user/model/types';
import { api } from '~/shared/api';

export class AuthApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // Google 네이티브 로그인
  async googleLogin(data: GoogleLoginDto, signal: AbortSignal): Promise<LoginResponseDto> {
    const response = await this.api.post('auth/google/native', {
      json: data,
      signal,
    });
    return response.json<LoginResponseDto>();
  }

  // Apple 네이티브 로그인
  async appleLogin(data: AppleLoginDto, signal: AbortSignal): Promise<LoginResponseDto> {
    const response = await this.api.post('auth/apple/native', {
      json: data,
      signal,
    });
    return response.json<LoginResponseDto>();
  }

  async refreshToken(data: RefreshTokenDto, signal: AbortSignal): Promise<RefreshTokenResponseDto> {
    const response = await this.api.post('auth/refresh', {
      json: data,
      signal,
    });
    return response.json<RefreshTokenResponseDto>();
  }

  // 로그아웃(서버에서 토큰 무효화)
  async logout(data: LogoutDto, signal: AbortSignal): Promise<{ message: string }> {
    const response = await this.api.post('auth/logout', {
      json: data,
      signal,
    });
    return response.json<{ message: string }>();
  }

  async validateToken(signal: AbortSignal): Promise<boolean> {
    const response = await this.api.get('auth/validate', { signal });
    return response.ok;
  }
}

export const authApi = new AuthApi(api);
