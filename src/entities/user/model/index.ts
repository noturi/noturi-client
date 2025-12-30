// Re-export types selectively to avoid naming conflicts
export type {
  User,
  GoogleLogin,
  AppleLogin,
  LoginResult,
  RefreshToken,
  RefreshResult,
  Logout,
  GoogleLoginDto,
  AppleLoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  LogoutDto,
} from './types';

export type { AuthTokens } from './auth';

export type {
  ThemeId,
  Language,
  UserSettings,
  UpdateUserSettingsDto,
  UserSettingsResponseDto,
} from './settings-types';

export { isUser, parseUser, isValidToken, isAuthenticated } from './auth';
