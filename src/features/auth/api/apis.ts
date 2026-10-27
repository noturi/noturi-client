import { KyInstance } from 'ky';
import { AppleLoginDto, GoogleLoginDto, LoginResponseDto } from '~/entities/user';
import { api } from '~/shared/api';

class AuthApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  async googleLogin(data: GoogleLoginDto): Promise<LoginResponseDto> {
    const response = await this.api.post('auth/google/native', { json: data });
    return response.json<LoginResponseDto>();
  }

  async appleLogin(data: AppleLoginDto): Promise<LoginResponseDto> {
    const response = await this.api.post('auth/apple/native', { json: data });
    return response.json<LoginResponseDto>();
  }

  /** 서버 로그아웃 — 현재 세션(리프레시 토큰)과 그 위젯 세션 폐기 */
  async logout(): Promise<void> {
    await this.api.post('auth/logout', { json: {} });
  }

  /** 위젯 전용 세션 발급 — 앱 세션과 독립적으로 회전하는 토큰 쌍 */
  async issueWidgetSession(): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await this.api.post('auth/widget-session');
    const { tokens } = await response.json<{
      tokens: { accessToken: string; refreshToken: string };
    }>();
    return tokens;
  }

  async deleteAccount(): Promise<void> {
    await this.api.delete('users/me');
  }
}

export const authApi = new AuthApi(api);
