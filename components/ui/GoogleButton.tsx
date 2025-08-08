import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Button } from 'tamagui';

import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import { router } from 'expo-router';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/auth';
import { useGoogleLoginMutation } from '@/services/auth';

import { GoogleIcon } from './GoogleIcon';

// 에러 메시지 매핑
const ERROR_MESSAGES = {
  [statusCodes.SIGN_IN_CANCELLED]: null,
  [statusCodes.IN_PROGRESS]: '이미 로그인이 진행 중입니다.',
  [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: 'Google Play Services를 사용할 수 없습니다.',
  default: 'Google 로그인에 실패했습니다.',
} as const;

export function GoogleButton() {
  const { saveAuthTokens, error, clearError } = useAuth();

  const googleLoginMutation = useGoogleLoginMutation({
    onSuccess: async (loginResponse) => {
      console.log('Login successful:', loginResponse);

      await saveAuthTokens({
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
        user: loginResponse.user,
      });

      router.replace(ROUTES.home.path);
    },
    onError: (error) => {
      console.error('Backend error:', error);
      Alert.alert('로그인 실패', '서버 오류가 발생했습니다.');
    },
  });

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    if (!error) return;

    Alert.alert('오류', error, [
      {
        text: '확인',
        onPress: clearError,
      },
    ]);
  }, [error, clearError]);

  // 에러 처리 함수
  const handleGoogleSignInError = (error: any) => {
    console.error('Google 로그인 오류:', error);

    const errorMessage =
      ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] ?? ERROR_MESSAGES.default;

    if (errorMessage) {
      Alert.alert('로그인 오류', errorMessage);
    }
  };

  // 구글 로그인 성공 처리
  const processGoogleSignInResponse = async (response: any) => {
    if (!isSuccessResponse(response)) {
      return;
    }

    const user = response.data;

    googleLoginMutation.mutate({
      googleId: user.user.id,
      email: user.user.email,
      name: user.user.name,
      photo: user.user.photo,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      clearError();

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }

      const response = await GoogleSignin.signIn();
      console.log('Google 로그인 응답:', response);

      await processGoogleSignInResponse(response);
    } catch (error: any) {
      handleGoogleSignInError(error);
    }
  };

  const isLoading = googleLoginMutation.isPending;

  return (
    <Button
      circular
      backgroundColor="$surface"
      borderColor="$border"
      borderWidth={1}
      disabled={isLoading}
      icon={<GoogleIcon height={24} width={24} />}
      size="$7"
      onPress={handleGoogleLogin}
    />
  );
}
