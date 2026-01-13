import {
  getAppVersion,
  hasNewVersion,
  needsForceUpdate,
  type PlatformVersion,
} from '~/entities/app-version';
import { Typography } from '~/shared/ui';

import { ReactNode, useEffect, useState } from 'react';
import { Alert, Linking, Modal, Platform, Pressable, View } from 'react-native';

import Constants from 'expo-constants';

interface UpdateCheckProviderProps {
  children: ReactNode;
}

type UpdateType = 'force' | 'optional' | null;

export function UpdateCheckProvider({ children }: UpdateCheckProviderProps) {
  const [updateType, setUpdateType] = useState<UpdateType>(null);
  const [storeUrl, setStoreUrl] = useState<string>('');

  useEffect(() => {
    checkAppVersion();

    // 🧪 테스트용: 3초 후 강제 팝업 (테스트 후 삭제)
    // setTimeout(() => {
    //   setStoreUrl('https://apps.apple.com/app/id123456789');
    //   setUpdateType('optional'); // 'force' 또는 'optional'
    // }, 3000);
  }, []);

  const checkAppVersion = async () => {
    try {
      const versionInfo = await getAppVersion();
      const currentVersion = Constants.expoConfig?.version || '1.0.0';
      const platformInfo: PlatformVersion =
        Platform.OS === 'ios' ? versionInfo.ios : versionInfo.android;

      setStoreUrl(platformInfo.storeUrl);

      if (needsForceUpdate(currentVersion, platformInfo.minVersion)) {
        setUpdateType('force');
      } else if (hasNewVersion(currentVersion, platformInfo.latestVersion)) {
        setUpdateType('optional');
      }
    } catch (error) {
      // 버전 체크 실패 시 무시 (앱 사용은 가능하게)
      console.warn('앱 버전 체크 실패:', error);
    }
  };

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  const handleLater = () => {
    setUpdateType(null);
  };

  return (
    <>
      {children}

      {/* 업데이트 팝업 */}
      <Modal transparent visible={updateType !== null} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full rounded-2xl bg-bg-primary p-6">
            <Typography className="mb-2 text-center" variant="title2">
              {updateType === 'force' ? '업데이트 필요' : '새 버전 출시'}
            </Typography>

            <Typography className="mb-6 text-center text-text-secondary" variant="body">
              {updateType === 'force'
                ? '앱을 계속 사용하려면 최신 버전으로 업데이트해주세요.'
                : '더 나은 경험을 위해 새 버전으로 업데이트해주세요.'}
            </Typography>

            <View className="gap-3">
              <Pressable
                className="items-center rounded-xl bg-text-primary py-4"
                onPress={handleUpdate}
              >
                <Typography className="font-sans-semibold text-white" variant="body">
                  업데이트
                </Typography>
              </Pressable>

              {updateType === 'optional' && (
                <Pressable className="items-center py-3" onPress={handleLater}>
                  <Typography className="text-text-secondary" variant="body">
                    나중에
                  </Typography>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
