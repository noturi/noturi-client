import {
  type AppleLoginDto,
  type GoogleLoginDto,
  type LoginResponseDto,
} from '~/entities/user/model/types';
import { queryClient } from '~/shared/api/query-client';

import { type DefaultError, type UseMutationOptions, useMutation } from '@tanstack/react-query';

import { authService } from '../model/auth-service';
import { authApi } from './apis';

type MutationVariables<T> = {
  dto: T;
  signal: AbortSignal;
};

export function useGoogleLoginMutation(
  options: Pick<
    UseMutationOptions<LoginResponseDto, DefaultError, MutationVariables<GoogleLoginDto>>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['auth', 'google-login', ...mutationKey],
    mutationFn: ({ dto, signal }: MutationVariables<GoogleLoginDto>) => {
      return authApi.googleLogin(dto, signal);
    },
    onMutate,
    onSuccess: async (loginResponse, loginData, context) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['auth', 'user'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['auth', 'profile'],
        }),
        onSuccess?.(loginResponse, loginData, context),
      ]);
    },
    onError,
    onSettled,
  });
}

export function useAppleLoginMutation(
  options: Pick<
    UseMutationOptions<LoginResponseDto, DefaultError, MutationVariables<AppleLoginDto>>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['auth', 'apple-login', ...mutationKey],
    mutationFn: ({ dto, signal }: MutationVariables<AppleLoginDto>) => {
      return authApi.appleLogin(dto, signal);
    },
    onMutate,
    onSuccess: async (loginResponse, loginData, context) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['auth', 'user'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['auth', 'profile'],
        }),
        onSuccess?.(loginResponse, loginData, context),
      ]);
    },
    onError,
    onSettled,
  });
}

export function useLogoutMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, AbortSignal>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['auth', 'logout', ...mutationKey],
    mutationFn: (signal: AbortSignal) => {
      return authService.logout(signal);
    },
    onMutate,
    onSuccess: async (_, __, context) => {
      // 모든 쿼리 캐시 클리어
      await queryClient.clear();

      // 인증 관련 쿼리들 무효화
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['auth'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['memos'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        }),
        onSuccess?.(_, __, context),
      ]);
    },
    onError,
    onSettled,
  });
}
