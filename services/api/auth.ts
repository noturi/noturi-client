import * as SecureStore from 'expo-secure-store';

import Logger from '../../utils/logger';

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('accessToken');
  } catch (error) {
    Logger.error('토큰 가져오기 실패', error);
    return null;
  }
};
