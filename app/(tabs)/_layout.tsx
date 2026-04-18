import { ApiErrorBoundary } from '~/shared/ui';

import { TabsRouter } from '../../src/application/router';

export default function TabsLayout() {
  return (
    <ApiErrorBoundary>
      <TabsRouter />
    </ApiErrorBoundary>
  );
}
