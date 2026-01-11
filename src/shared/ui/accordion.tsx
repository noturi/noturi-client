import { ChevronDown } from '~/shared/lib/icons';

import { ReactNode, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Typography } from './typography';

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, icon, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState(0);

  const rotation = useSharedValue(defaultOpen ? 180 : 0);
  const height = useSharedValue(defaultOpen ? 1 : 0);
  const opacity = useSharedValue(defaultOpen ? 1 : 0);

  const toggleAccordion = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    rotation.value = withTiming(newIsOpen ? 180 : 0, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    height.value = withTiming(newIsOpen ? 1 : 0, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    opacity.value = withTiming(newIsOpen ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: height.value * contentHeight,
    opacity: opacity.value,
    overflow: 'hidden',
  }));

  return (
    <View>
      <Pressable
        className="flex-row items-center gap-3 rounded-5 px-4 py-3 active:bg-bg-secondary"
        onPress={toggleAccordion}
      >
        {icon}
        <Typography className="flex-1 text-text-primary" variant="callout">
          {title}
        </Typography>
        <Animated.View style={chevronStyle}>
          <ChevronDown className="text-text-muted" size={16} />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentStyle}>
        <View
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            if (measuredHeight > 0 && contentHeight === 0) {
              setContentHeight(measuredHeight);
              if (defaultOpen) {
                height.value = 1;
              }
            }
          }}
        >
          {children}
        </View>
      </Animated.View>

      {/* Hidden view to measure content height */}
      {contentHeight === 0 && (
        <View
          className="absolute opacity-0"
          pointerEvents="none"
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            if (measuredHeight > 0) {
              setContentHeight(measuredHeight);
              if (defaultOpen) {
                height.value = 1;
              }
            }
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
