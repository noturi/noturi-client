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
  // 계정 알림 설정과 무관하게 기기만 등록 — 설정은 users/me/settings로 따로 변경
  registerOnly: true;
  // registerOnly를 모르는 옛 서버용 — 설정을 켜지 않는 갱신 등록으로 처리됨 (새 서버는 registerOnly 우선)
  refreshOnly: true;
}
