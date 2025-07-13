import {
  useMutation,
  type DefaultError,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { queryClient } from "@/app/_layout";
import {
  authApi,
  type GoogleLoginDto,
  type LoginResponseDto,
} from "../../services/auth";

export function useGoogleLoginMutation(
  options: Pick<
    UseMutationOptions<LoginResponseDto, DefaultError, GoogleLoginDto>,
    "mutationKey" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  > = {}
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ["auth", "google-login", ...mutationKey],
    mutationFn: (dto: GoogleLoginDto) => {
      return authApi.googleLogin(dto);
    },
    onMutate,
    onSuccess: async (loginResponse, loginData, context) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["auth", "user"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["auth", "profile"],
        }),
        onSuccess?.(loginResponse, loginData, context),
      ]);
    },
    onError,
    onSettled,
  });
}
