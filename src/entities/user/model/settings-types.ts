// 테마 ID 타입
export type ThemeId = 'light' | 'dark' | 'sepia' | 'navy' | 'forest' | 'lavender';

// 언어 타입
export type Language = 'ko' | 'en';

// 사용자 설정 타입
export type UserSettings = {
  theme: ThemeId;
  language: Language;
  notification: boolean;
};

// 설정 업데이트 DTO (부분 업데이트)
export type UpdateUserSettingsDto = Partial<UserSettings>;

// 설정 응답 DTO
export type UserSettingsResponseDto = UserSettings;
