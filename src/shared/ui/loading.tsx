import { ActivityIndicator, View } from 'react-native';

import { Typography } from './typography';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  flex?: boolean;
}

export function Loading({ text = '', size = 'small', flex = true }: LoadingProps) {
  return (
    <View className={`items-center justify-center gap-5 py-10 ${flex ? 'flex-1' : ''}`}>
      <ActivityIndicator className="text-text-secondary" size={size} />
      {text && <Typography variant="caption1">{text}</Typography>}
    </View>
  );
}
