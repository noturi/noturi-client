import { UpdateUserSettingsDto } from '~/entities/user';
import { QUERY_KEYS } from '~/shared/lib';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userSettingsApi } from './api';

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserSettingsDto) => userSettingsApi.updateSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.userSettings, data);
    },
  });
};
