import { useAuth } from '~/entities/auth';
import { HREFS } from '~/shared/config';
import { Loading } from '~/shared/ui';

import { Redirect } from 'expo-router';

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return <Loading />;
  }

  return <Redirect href={isAuthenticated ? HREFS.tabs() : HREFS.login()} />;
}
