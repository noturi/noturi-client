import { ApiErrorBoundary, Loading } from '~/shared/ui';

import { Suspense } from 'react';

import { HomeScreen } from './home-screen';

export function HomePage() {
  return (
    <ApiErrorBoundary>
      <Suspense fallback={<Loading />}>
        <HomeScreen />
      </Suspense>
    </ApiErrorBoundary>
  );
}
