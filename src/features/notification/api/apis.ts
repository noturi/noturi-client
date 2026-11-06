import type { KyInstance } from 'ky';
import { api } from '~/shared/api';

import type { Device, RegisterDeviceDto } from '../model/types';

class DeviceApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 디바이스 등록 (푸시 토큰)
  async registerDevice(data: RegisterDeviceDto): Promise<Device> {
    const response = await this.api.post('devices', {
      json: data,
    });
    return response.json<Device>();
  }
}

export const deviceApi = new DeviceApi(api);
