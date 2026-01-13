export interface PlatformVersion {
  latestVersion: string;
  minVersion: string;
  storeUrl: string;
}

export interface AppVersionResponse {
  ios: PlatformVersion;
  android: PlatformVersion;
}
