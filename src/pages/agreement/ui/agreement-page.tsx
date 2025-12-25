import { router } from 'expo-router';
import { ExternalLink } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EXTERNAL_LINKS, HREFS } from '~/shared/config';
import { Checkbox, SubmitButton, Typography } from '~/shared/ui';

export function AgreementPage() {
  const [agreed, setAgreed] = useState(false);
  const insets = useSafeAreaInsets();

  const handleTermsPress = () => {
    Linking.openURL(EXTERNAL_LINKS.PRIVACY_POLICY);
  };

  const handleAgree = () => {
    router.replace(HREFS.tabs());
  };

  return (
    <View
      className="flex-1 justify-between bg-bg-primary px-5 pt-5"
      style={{ paddingBottom: insets.bottom + 20 }}
    >
      <View className="flex-1 gap-6 justify-center" style={{ marginTop: -80 }}>
        <View className="gap-2">
          <Typography variant="title1">서비스 이용을 위해</Typography>
          <Typography variant="title1">약관에 동의해주세요</Typography>
        </View>

        <Pressable className="flex-row items-center gap-3" onPress={() => setAgreed(!agreed)}>
          <Checkbox checked={agreed} onCheckedChange={setAgreed} />
          <Pressable className="flex-row items-center gap-1" onPress={handleTermsPress}>
            <Typography className="text-blue-500" variant="body">
              이용약관 및 개인정보처리방침
            </Typography>
            <ExternalLink color="#3b82f6" size={14} />
          </Pressable>
          <Typography className="text-text-secondary" variant="body">
            에 동의합니다
          </Typography>
        </Pressable>
      </View>

      <SubmitButton disabled={!agreed} position="static" onPress={handleAgree}>
        시작하기
      </SubmitButton>
    </View>
  );
}
