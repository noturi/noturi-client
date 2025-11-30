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

  // 내 디바이스 목록 조회
  async getMyDevices(): Promise<Device[]> {
    const response = await this.api.get('devices');
    return response.json<Device[]>();
  }

  // 디바이스 삭제 (푸시 알림 해제)
  async deleteDevice(id: string): Promise<void> {
    await this.api.delete(`devices/${id}`);
  }

  // 모든 디바이스 삭제 (모든 푸시 알림 해제)
  async deleteAllDevices(): Promise<void> {
    await this.api.delete('devices');
  }
}

export const deviceApi = new DeviceApi(api);
