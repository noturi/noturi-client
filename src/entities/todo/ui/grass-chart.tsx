import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useThemeColor } from '~/application/providers/theme-provider';
import { Card, Typography } from '~/shared/ui';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, type ScrollView as ScrollViewType, View } from 'react-native';

import { GrassDay } from '../model/types';

/** Date → "YYYY-MM-DD" (로컬 시간 기준) */
function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const CELL_SIZE = 14;
const CELL_GAP = 3;

// level(0~4)에 따른 opacity
const LEVEL_OPACITY = [0, 0.25, 0.45, 0.7, 1.0];

/** 0~1 opacity → 2자리 hex */
function alphaHex(opacity: number): string {
  return Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
}

interface GrassChartProps {
  data: GrassDay[];
}

/**
 * 오늘 기준 6개월 전체를 주 단위 열로 생성 (GitHub 스타일)
 * 7행(일~토) × ~26열(주), 가로 = 시간 흐름 (좌→우 = 과거→현재)
 * 오늘 = 마지막 열의 해당 요일 행
 */
function buildColumns(data: GrassDay[]): (GrassDay | null)[][] {
  const dateMap = new Map(data.map((d) => [d.date.slice(0, 10), d]));

  // 오늘 기준 6개월 전부터 오늘까지
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 6);

  // 시작일을 해당 주 일요일로 맞춤
  const startDayIdx = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDayIdx);

  const columns: (GrassDay | null)[][] = [];
  let currentCol: (GrassDay | null)[] = [];

  const current = new Date(startDate);
  while (current <= today) {
    const key = toLocalDateStr(current);
    currentCol.push(dateMap.get(key) ?? { date: key, total: 0, completed: 0, rate: 0, level: 0 });

    if (currentCol.length === 7) {
      columns.push(currentCol);
      currentCol = [];
    }

    current.setDate(current.getDate() + 1);
  }

  // 마지막 주 남은 셀 패딩
  if (currentCol.length > 0) {
    while (currentCol.length < 7) {
      currentCol.push(null);
    }
    columns.push(currentCol);
  }

  return columns;
}

export function GrassChart({ data }: GrassChartProps) {
  const accentColor = useThemeColor('accent');
  const borderColor = useThemeColor('border');
  const textPrimaryColor = useThemeColor('textPrimary');
  const [selectedDay, setSelectedDay] = useState<GrassDay | null>(null);
  const todayStr = useMemo(() => toLocalDateStr(new Date()), []);

  const columns = useMemo(() => buildColumns(data), [data]);

  const scrollRef = useRef<ScrollViewType>(null);

  const handleCellPress = useCallback((cell: GrassDay) => {
    setSelectedDay((prev) => (prev?.date === cell.date ? null : cell));
  }, []);

  return (
    <View className="gap-3">
      <Card>
        <ScrollView
          ref={scrollRef}
          horizontal
          contentContainerStyle={{ flexDirection: 'row', gap: CELL_GAP }}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {columns.map((col, colIdx) => (
            <View key={colIdx} style={{ gap: CELL_GAP }}>
              {col.map((cell, rowIdx) => {
                if (!cell) {
                  return (
                    <View
                      key={`${colIdx}-${rowIdx}`}
                      style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    />
                  );
                }

                const isActive = cell.level > 0;
                const isSelected = selectedDay?.date === cell.date;
                const isToday = cell.date === todayStr;

                return isActive ? (
                  <Pressable key={`${colIdx}-${rowIdx}`} onPress={() => handleCellPress(cell)}>
                    <View
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        borderRadius: 3,
                        backgroundColor: accentColor + alphaHex(LEVEL_OPACITY[cell.level]),
                        borderWidth: isToday || isSelected ? 1 : 0,
                        borderColor: isToday
                          ? textPrimaryColor
                          : isSelected
                            ? accentColor
                            : undefined,
                      }}
                    />
                  </Pressable>
                ) : (
                  <View
                    key={`${colIdx}-${rowIdx}`}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      borderRadius: 3,
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: isToday ? textPrimaryColor : borderColor + '40',
                    }}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </Card>

      {/* 선택된 셀 정보 */}
      {selectedDay ? (
        <Pressable onPress={() => setSelectedDay(null)}>
          <Card className="flex-row items-center justify-between">
            <Typography variant="caption1">
              {format(new Date(selectedDay.date), 'M월 d일 (E)', { locale: ko })}
            </Typography>
            <Typography variant="caption1">
              {selectedDay.completed}/{selectedDay.total}개 완료 ({selectedDay.rate}%)
            </Typography>
          </Card>
        </Pressable>
      ) : (
        <Card className="opacity-0">
          <Typography variant="caption1">&nbsp;</Typography>
        </Card>
      )}
    </View>
  );
}
