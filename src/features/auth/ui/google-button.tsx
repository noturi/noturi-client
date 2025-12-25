import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useGoogleLoginMutation } from '~/features/auth/api';
import { useLoginHandler } from '~/features/auth/model/use-login-handler';
import { useUserTheme } from '~/features/theme';

import { useEffect } from 'react';
import { Alert, Platform, Pressable } from 'react-native';

import { GoogleIcon } from './google-icon';

const ERROR_MESSAGES: Record<string, string | null> = {
  [statusCodes.SIGN_IN_CANCELLED]: null,
  [statusCodes.IN_PROGRESS]: '이미 로그인이 진행 중입니다.',
  [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: 'Google Play Services를 사용할 수 없습니다.',
};

export function GoogleButton() {
  const { handleLoginSuccess, clearError } = useLoginHandler();
  const { hexColors } = useUserTheme();

  const googleLoginMutation = useGoogleLoginMutation({
    onSuccess: handleLoginSuccess,
  });

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const handlePress = async () => {
    try {
      clearError();

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }

      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response) || !response.data.idToken) {
        return;
      }

      const { user, idToken } = response.data;

      googleLoginMutation.mutate({
        googleId: user.id,
        email: user.email,
        name: user.name,
        photo: user.photo,
        idToken,
      });
    } catch (e: any) {
      const message = ERROR_MESSAGES[e.code] ?? 'Google 로그인에 실패했습니다.';
      if (message) Alert.alert('로그인 오류', message);
    }
  };

  return (
    <Pressable
      className="h-14 w-14 items-center justify-center rounded-full"
      disabled={googleLoginMutation.isPending}
      style={{
        backgroundColor: hexColors.surface,
        borderColor: hexColors.border,
        borderWidth: 1,
        opacity: googleLoginMutation.isPending ? 0.5 : 1,
      }}
      onPress={handlePress}
    >
      <GoogleIcon height={24} width={24} />
    </Pressable>
  );
}
