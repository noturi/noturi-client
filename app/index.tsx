import { Redirect } from 'expo-router';

import { useAuth } from '../src/features/auth';
import { HREFS } from '../src/shared/constants';
import { Loading } from '../src/shared/ui';

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return <Loading />;
  }

  return <Redirect href={isAuthenticated ? HREFS.tabs() : HREFS.login()} />;
}
