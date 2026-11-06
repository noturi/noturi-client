import { getErrorMessage } from '~/shared/lib/error';
import Logger from '~/shared/lib/logger';

import { Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { deviceApi } from '../api/apis';
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

/**
 * 알림은 계정 설정(UserSettings.notification)을 따른다 — 켜고 끄면 같은 계정의 모든 기기에 적용.
 * 기기 등록은 "이 기기로 받을 수 있다"는 뜻만 가지며 설정과 무관하게 유지하고, 발송 여부는 서버가 계정 설정으로 거른다.
 */
class NotificationService {
  private expoPushToken: string | null = null;
  /** 이번 로그인 세션에서 서버 등록을 마친 토큰 — 포그라운드 복귀마다 다시 등록하지 않도록 */
  private registeredToken: string | null = null;

  // 이 기기의 OS 알림 권한
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
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
    } catch (error) {
      // 시뮬레이터에서는 aps-environment 에러가 발생함 - 정상적인 동작
      if (getErrorMessage(error).includes('aps-environment')) {
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

  // 이 기기를 계정의 알림 대상으로 등록 — 계정 알림 설정은 바꾸지 않음 (설정은 users/me/settings로 따로)
  async registerThisDevice(): Promise<boolean> {
    const token = await this.getExpoPushToken();
    if (!token) {
      return false;
    }

    await deviceApi.registerDevice({
      expoPushToken: token,
      deviceName: this.getDeviceName(),
      platform: Platform.OS as DevicePlatform,
      registerOnly: true,
      refreshOnly: true,
    });

    this.registeredToken = token;
    Logger.info('디바이스 등록 성공');
    return true;
  }

  /**
   * 로그인 후·앱 포그라운드마다 이 기기 등록을 맞춘다
   * - 권한 허용: 계정 설정과 무관하게 등록 (발송 여부는 서버가 계정 설정으로 거름)
   * - 권한 미결정 + 계정 알림 켜짐: 권한을 물어보고 등록 (알림을 켜둔 계정으로 새 기기에 로그인한 경우)
   * - 권한 거부: 아무것도 하지 않음 (설정 화면에서 안내)
   */
  async syncThisDevice({ accountNotificationEnabled }: { accountNotificationEnabled: boolean }) {
    try {
      const status = await this.getPermissionStatus();
      if (status === 'granted') {
        if (!this.registeredToken) {
          await this.registerThisDevice();
        }
        return;
      }
      if (
        status === 'undetermined' &&
        accountNotificationEnabled &&
        (await this.requestPermissions())
      ) {
        await this.registerThisDevice();
      }
    } catch (error) {
      Logger.warn('디바이스 등록 동기화 실패:', error);
    }
  }

  /** 로그아웃(자동 로그아웃 포함) 시 호출 — 다음에 로그인하는 계정에 이 기기를 다시 등록하도록 */
  forgetRegistration() {
    this.registeredToken = null;
  }

  /** 로그아웃 시 서버에 넘길 이 기기 토큰 — 서버가 이 기기만 알림 대상에서 뺀다. 오프라인에서 로그아웃이 멈추지 않게 3초 제한 */
  async getThisDeviceToken(): Promise<string | null> {
    if (this.expoPushToken) {
      return this.expoPushToken;
    }
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    return Promise.race([this.getExpoPushToken(), timeout]);
  }
}

export const notificationService = new NotificationService();
