import { QUERY_KEYS } from '~/shared/lib';

import { queryOptions } from '@tanstack/react-query';

import { settingsApi } from './settings-api';

export const userSettingsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.userSettings,
    queryFn: () => settingsApi.getSettings(),
  });
