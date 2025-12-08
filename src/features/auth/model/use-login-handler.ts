import { useAuth } from '~/application/providers/auth-provider';
import type { LoginResponseDto } from '~/entities/user/model/types';
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
    router.replace(HREFS.tabs());
  };

  return { handleLoginSuccess, clearError };
}
