import { View, ViewProps } from 'react-native';

export function Screen({ children, style, ...props }: ViewProps) {
  return (
    <View className="flex-1 bg-bg-primary p-10" style={style} {...props}>
      {children}
    </View>
  );
}

export function LayoutCard({ children, style, ...props }: ViewProps) {
  return (
    <View className="bg-surface border border-border rounded-6 p-6" style={style} {...props}>
      {children}
    </View>
  );
}

export function Logo({ children, style, ...props }: ViewProps) {
  return (
    <View
      className="w-[60px] h-[60px] bg-primary rounded-5 justify-center items-center"
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
