import ky from 'ky';

import { AppVersionResponse } from '../model/types';

export async function getAppVersion(): Promise<AppVersionResponse> {
  const response = await ky.get(`${process.env.EXPO_PUBLIC_BASE_URL}/app-version`);
  return response.json<AppVersionResponse>();
}
