import { useAuth } from '~/entities/auth';
import type { LoginResponseDto } from '~/entities/user/model/types';
import { notificationService } from '~/features/notification';
import { HREFS } from '~/shared/config';

import { useEffect } from 'react';
import { Alert } from 'react-native';

import { router } from 'expo-router';

export function useLoginHandler() {
  const { saveAuthTokens, error, clearError } = useAuth();

  useEffect(() => {
    if (!error) return;
    Alert.alert('오류', error, [{ text: '확인', onPress: clearError }]);
  }, [error, clearError]);

  const handleLoginSuccess = async (loginResponse: LoginResponseDto) => {
    await saveAuthTokens({
      accessToken: loginResponse.tokens.accessToken,
      refreshToken: loginResponse.tokens.refreshToken,
      user: loginResponse.user,
    });

    // 로그인 후 푸시 토큰 갱신 (fire-and-forget)
    notificationService.refreshDeviceTokenSilently().catch(() => {});

    // 신규 회원이면 약관 동의 페이지로, 기존 회원이면 홈으로
    if (loginResponse.isNewUser) {
      router.replace(HREFS.agreement());
    } else {
      router.replace(HREFS.tabs());
    }
  };

  return { handleLoginSuccess, clearError };
}
