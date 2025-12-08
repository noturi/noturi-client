import {
  type AppleLoginDto,
  type GoogleLoginDto,
  type LoginResponseDto,
} from '~/entities/user/model/types';
import { queryClient } from '~/shared/api/query-client';
import { authTokenCache } from '~/shared/lib/cache';

import { type DefaultError, type UseMutationOptions, useMutation } from '@tanstack/react-query';

import { authApi } from './api';

export function useGoogleLoginMutation(
  options: Pick<
    UseMutationOptions<LoginResponseDto, DefaultError, GoogleLoginDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['auth', 'google-login', ...mutationKey],
    mutationFn: (dto: GoogleLoginDto) => authApi.googleLogin(dto),
    onMutate,
    onSuccess: async (loginResponse, loginData, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] }),
        queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] }),
        onSuccess?.(loginResponse, loginData, context),
      ]);
    },
    onError,
    onSettled,
  });
}

export function useAppleLoginMutation(
  options: Pick<
    UseMutationOptions<LoginResponseDto, DefaultError, AppleLoginDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['auth', 'apple-login', ...mutationKey],
    mutationFn: (dto: AppleLoginDto) => authApi.appleLogin(dto),
    onMutate,
    onSuccess: async (loginResponse, loginData, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] }),
        queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] }),
        onSuccess?.(loginResponse, loginData, context),
      ]);
    },
    onError,
    onSettled,
  });
}

export function useLogoutMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, void>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['auth', 'logout', ...mutationKey],
    mutationFn: () => authTokenCache.clearAuthTokens(),
    onMutate,
    onSuccess: async (_, __, context) => {
      await queryClient.clear();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth'] }),
        queryClient.invalidateQueries({ queryKey: ['memos'] }),
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
        onSuccess?.(_, __, context),
      ]);
    },
    onError,
    onSettled,
  });
}
