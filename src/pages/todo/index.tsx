import { Card, Typography } from '~/shared/ui';

import { View } from 'react-native';

export function TodoPage() {
  return (
    <View className="flex-1 gap-4 bg-bg-secondary px-4 pt-4">
      <Card>
        <Typography variant="title3">투두</Typography>
      </Card>
    </View>
  );
}
