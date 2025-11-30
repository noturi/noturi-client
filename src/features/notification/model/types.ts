// 디바이스 플랫폼 타입
export type DevicePlatform = 'ios' | 'android';

// 디바이스 정보 응답 타입
export interface Device {
  id: string;
  expoPushToken: string;
  deviceName: string;
  platform: DevicePlatform;
  isActive: boolean;
  createdAt: string;
  lastActiveAt: string;
}

// 디바이스 등록 요청 타입
export interface RegisterDeviceDto {
  expoPushToken: string;
  deviceName: string;
  platform: DevicePlatform;
}
