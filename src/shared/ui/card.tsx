import { View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, className, ...props }: CardProps) {
  return (
    <View className={`rounded-6 bg-surface p-3 ${className ?? ''}`} style={style} {...props}>
      {children}
    </View>
  );
}
