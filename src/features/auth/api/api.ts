import { KyInstance } from 'ky';
import { AppleLoginDto, GoogleLoginDto, LoginResponseDto } from '~/entities/user/model/types';
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

  async deleteAccount(): Promise<void> {
    await this.api.delete('users/me');
  }
}

export const authApi = new AuthApi(api);
