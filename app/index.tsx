import { Redirect } from 'expo-router';

import { useAuth } from '../src/features/auth/model';
import { HREFS } from '../src/shared/config';
import { Loading } from '../src/widgets';

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return <Loading />;
  }

  return <Redirect href={isAuthenticated ? HREFS.tabs() : HREFS.login()} />;
}
