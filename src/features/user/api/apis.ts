import { KyInstance } from 'ky';
import { UpdateUserSettingsDto, UserSettingsResponseDto } from '~/entities/user';
import { api } from '~/shared/api';

class UserSettingsApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  async updateSettings(data: UpdateUserSettingsDto): Promise<UserSettingsResponseDto> {
    const response = await this.api.patch('users/me/settings', { json: data });
    return response.json<UserSettingsResponseDto>();
  }
}

export const userSettingsApi = new UserSettingsApi(api);
