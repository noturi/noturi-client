import { KyInstance } from 'ky';
import { api } from '~/shared/api';

import { UserSettingsResponseDto } from '../model/settings-types';

class SettingsApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  async getSettings(): Promise<UserSettingsResponseDto> {
    const response = await this.api.get('users/me/settings');
    return response.json<UserSettingsResponseDto>();
  }
}

export const settingsApi = new SettingsApi(api);
