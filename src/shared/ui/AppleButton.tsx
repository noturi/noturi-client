import { useAppleLoginMutation, useAuth } from '~/features/auth';
import { ROUTES } from '~/shared/constants';

import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';

export function AppleButton() {
  const { saveAuthTokens, error, clearError } = useAuth();

  const appleLoginMutation = useAppleLoginMutation({
    onSuccess: async (loginResponse) => {
      console.log('Apple Login successful:', loginResponse);

      await saveAuthTokens({
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
        user: loginResponse.user,
      });

      router.replace(ROUTES.home.path);
    },
  });

  useEffect(() => {
    if (!error) return;

    Alert.alert('오류', error, [
      {
        text: '확인',
        onPress: clearError,
      },
    ]);
  }, [error, clearError]);

  const handleAppleLogin = async () => {
    try {
      clearError();

      if (Platform.OS !== 'ios') {
        Alert.alert('알림', 'Apple 로그인은 iOS에서만 사용할 수 있습니다.');
        return;
      }

      // Apple 로그인 가능 여부 확인
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('알림', 'Apple 로그인을 사용할 수 없습니다.');
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('Apple 로그인 응답:', credential);

      // Apple에서 받은 정보로 서버에 로그인 요청
      appleLoginMutation.mutate({
        appleId: credential.user,
        email: credential.email || '',
        name: credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : undefined,
      });
    } catch (error: any) {
      console.error('Apple 로그인 오류:', error);

      if (error.code === 'ERR_REQUEST_CANCELED') {
        // 사용자가 취소한 경우 - 아무것도 하지 않음
        return;
      }

      Alert.alert('로그인 오류', 'Apple 로그인에 실패했습니다.');
    }
  };

  // const isLoading = appleLoginMutation.isPending;

  // iOS에서만 보이도록 함
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      cornerRadius={22}
      style={{
        height: 44,
        width: 44,
      }}
      onPress={handleAppleLogin}
    />
  );
}
