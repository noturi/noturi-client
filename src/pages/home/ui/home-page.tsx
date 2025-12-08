import { ApiErrorBoundary, Loading } from '~/widgets';

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
