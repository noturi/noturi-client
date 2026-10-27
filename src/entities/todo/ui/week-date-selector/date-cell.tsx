import { getDay, isToday } from 'date-fns';
import { BOUNCE_DURATION } from '~/shared/config';
import { CircularProgress, Typography } from '~/shared/ui';

import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { getDayLabel } from '../../lib/date-utils';

// 날짜 원 크기 상수
const CIRCLE_SIZE = 36;
const PROGRESS_STROKE = 3;
const TODAY_INNER_SIZE = 30;

interface DateCellProps {
  date: Date;
  isSelected: boolean;
  progress: number;
  width: number;
  onPress: (date: Date) => void;
}

/**
 * 날짜 스트립의 셀 하나: 요일 + 완료율 링 + 날짜. 선택되는 순간 바운스 애니메이션
 */
export function DateCell({ date, isSelected, progress, width, onPress }: DateCellProps) {
  const dayOfWeek = getDay(date);
  const scale = useSelectBounce(isSelected);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Pressable className="items-center py-2" style={{ width }} onPress={() => onPress(date)}>
      <Typography className={getDayLabelClassName(dayOfWeek)} variant="caption2">
        {getDayLabel(dayOfWeek)}
      </Typography>

      <View className="my-1 items-center">
        <Animated.View style={isSelected ? animatedStyle : undefined}>
          <CircularProgress progress={progress} size={CIRCLE_SIZE} strokeWidth={PROGRESS_STROKE}>
            <DateNumber date={date} isSelected={isSelected} />
          </CircularProgress>
        </Animated.View>
      </View>
    </Pressable>
  );
}

/** 선택되지 않은 상태 → 선택 상태로 바뀔 때만 0.8 → 1.1 → 1 스케일 바운스 */
function useSelectBounce(isSelected: boolean) {
  const scale = useSharedValue(1);
  const prevSelectedRef = useRef(isSelected);

  useEffect(() => {
    if (isSelected && !prevSelectedRef.current) {
      scale.set(
        withSequence(
          withTiming(0.8, { duration: BOUNCE_DURATION.squash }),
          withTiming(1.1, { duration: BOUNCE_DURATION.overshoot }),
          withTiming(1, { duration: BOUNCE_DURATION.settle }),
        ),
      );
    }
    prevSelectedRef.current = isSelected;
  }, [isSelected, scale]);

  return scale;
}

function getDayLabelClassName(dayOfWeek: number): string {
  if (dayOfWeek === 0) return 'text-error';
  if (dayOfWeek === 6) return 'text-accent';
  return 'text-text-secondary';
}

function DateNumber({ date, isSelected }: { date: Date; isSelected: boolean }) {
  if (isSelected) {
    return (
      <View
        className="items-center justify-center rounded-full bg-primary"
        style={{ width: TODAY_INNER_SIZE, height: TODAY_INNER_SIZE }}
      >
        <Typography className="!text-primary-text" variant="callout" weight="semibold">
          {date.getDate()}
        </Typography>
      </View>
    );
  }

  if (isToday(date)) {
    return (
      <View
        className="items-center justify-center rounded-full bg-accent/20"
        style={{ width: TODAY_INNER_SIZE, height: TODAY_INNER_SIZE }}
      >
        <Typography className="!text-accent-text" variant="callout" weight="semibold">
          {date.getDate()}
        </Typography>
      </View>
    );
  }

  return <Typography variant="callout">{date.getDate()}</Typography>;
}
