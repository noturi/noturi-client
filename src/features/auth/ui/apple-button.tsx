import { useAppleLoginMutation } from '~/features/auth/api';
import { useLoginHandler } from '~/features/auth/model/use-login-handler';

import { Alert, Platform } from 'react-native';

import * as AppleAuthentication from 'expo-apple-authentication';

export function AppleButton() {
  const { handleLoginSuccess, clearError } = useLoginHandler();

  const appleLoginMutation = useAppleLoginMutation({
    onSuccess: handleLoginSuccess,
  });

  const parseEmailFromToken = (idToken: string): string | null => {
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return payload.email;
    } catch {
      return null;
    }
  };

  const handlePress = async () => {
    try {
      clearError();

      if (Platform.OS !== 'ios') {
        Alert.alert('알림', 'Apple 로그인은 iOS에서만 사용할 수 있습니다.');
        return;
      }

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

      const email =
        credential.email ||
        (credential.identityToken && parseEmailFromToken(credential.identityToken));
      const name = credential.fullName
        ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
        : undefined;

      appleLoginMutation.mutate({
        appleId: credential.user,
        email: email || '',
        name,
        idToken: credential.identityToken || '',
        user: credential.user,
      });
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') return;
      Alert.alert('로그인 오류', 'Apple 로그인에 실패했습니다.');
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      cornerRadius={22}
      style={{ height: 44, width: 44 }}
      onPress={handlePress}
    />
  );
}
