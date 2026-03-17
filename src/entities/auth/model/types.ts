import { User } from '~/entities/user';

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  error: string | null;
  saveAuthTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface AuthState {
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  error: string | null;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}
