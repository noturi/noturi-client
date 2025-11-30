import Logger from '~/shared/lib/logger';

import { Platform } from 'react-native';

import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { deviceApi } from '../api/api';
import type { DevicePlatform } from './types';

// 알림 핸들러 설정 (앱이 포그라운드일 때 알림 표시 방법)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private expoPushToken: string | null = null;

  // 실제 기기인지 확인 (시뮬레이터/에뮬레이터가 아닌지)
  private isPhysicalDevice(): boolean {
    // 개발 빌드에서 시뮬레이터인 경우 false 반환
    // bare 또는 storeClient 환경에서만 true
    const executionEnvironment = Constants.executionEnvironment;
    return executionEnvironment === ExecutionEnvironment.Bare;
  }

  // 푸시 알림 권한 요청
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Logger.warn('푸시 알림 권한이 거부되었습니다');
      return false;
    }

    return true;
  }

  // Expo Push Token 획득
  async getExpoPushToken(): Promise<string | null> {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (!projectId) {
        Logger.warn('EAS Project ID가 설정되지 않았습니다');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = tokenData.data;
      Logger.info('Expo Push Token 획득 성공:', this.expoPushToken);

      return this.expoPushToken;
    } catch (error: any) {
      // 시뮬레이터에서는 aps-environment 에러가 발생함 - 정상적인 동작
      if (error?.message?.includes('aps-environment')) {
        Logger.info('시뮬레이터에서는 푸시 알림을 지원하지 않습니다');
      } else {
        Logger.warn('Expo Push Token 획득 실패:', error);
      }
      return null;
    }
  }

  // 디바이스 이름 가져오기
  private getDeviceName(): string {
    // expo-device 없이 기본값 사용
    if (Platform.OS === 'ios') {
      return 'iPhone';
    } else if (Platform.OS === 'android') {
      return 'Android Device';
    }
    return 'Unknown Device';
  }

  // 디바이스 등록 (권한 요청 → 토큰 획득 → 서버 등록)
  async registerDevice(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      const token = await this.getExpoPushToken();
      if (!token) {
        return false;
      }

      const deviceName = this.getDeviceName();
      const platform: DevicePlatform = Platform.OS as DevicePlatform;

      await deviceApi.registerDevice({
        expoPushToken: token,
        deviceName,
        platform,
      });

      Logger.info('디바이스 등록 성공');
      return true;
    } catch (error) {
      Logger.error('디바이스 등록 실패:', error);
      return false;
    }
  }

  // 모든 디바이스 삭제 (로그아웃 시 사용)
  async unregisterAllDevices(): Promise<void> {
    try {
      await deviceApi.deleteAllDevices();
      this.expoPushToken = null;
      Logger.info('모든 디바이스 등록 해제 성공');
    } catch (error) {
      Logger.error('디바이스 등록 해제 실패:', error);
    }
  }

  // 현재 저장된 토큰 반환
  getStoredToken(): string | null {
    return this.expoPushToken;
  }

  // 현재 알림 권한 상태 확인
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  // 알림이 활성화되어 있는지 확인 (서버에 등록된 디바이스가 있는지)
  async isNotificationEnabled(): Promise<boolean> {
    try {
      const status = await this.getPermissionStatus();
      if (status !== 'granted') {
        return false;
      }

      // 서버에서 디바이스 목록 조회
      const devices = await deviceApi.getMyDevices();
      return devices.length > 0;
    } catch {
      return false;
    }
  }
}

export const notificationService = new NotificationService();
