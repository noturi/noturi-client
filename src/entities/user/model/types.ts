// 기본 도메인 타입들
export type User = {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatarUrl: string;
};

export type GoogleLogin = {
  googleId: string;
  email: string;
  name: string | null;
  photo: string | null;
  idToken: string;
  deviceId?: string;
  timestamp: Date;
};

export type AppleLogin = {
  appleId: string;
  email: string;
  name?: string;
  idToken: string;
  user: string;
  deviceId?: string;
  timestamp: Date;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresAt: Date;
};

export type RefreshToken = {
  refreshToken: string;
  deviceId?: string;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
};

export type Logout = {
  refreshToken: string;
};

export type GoogleLoginDto = Omit<GoogleLogin, 'timestamp' | 'deviceId'>;
export type AppleLoginDto = Omit<AppleLogin, 'timestamp' | 'deviceId'>;
export type LoginResponseDto = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: Pick<User, 'id' | 'email' | 'name' | 'nickname' | 'avatarUrl'>;
};
export type RefreshTokenDto = Pick<RefreshToken, 'refreshToken'>;
export type RefreshTokenResponseDto = Omit<RefreshResult, 'expiresAt'>;
export type LogoutDto = Pick<Logout, 'refreshToken'>;
