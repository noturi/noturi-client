import type {
  CalendarMemo,
  CreateCalendarMemoDto,
  UpdateCalendarMemoDto,
} from '~/entities/calendar';
import { ControlledSheet, FloatingButton, Form, Input, Select, Switch } from '~/shared/ui';

import { View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { useCalendarMemoForm } from '../model';
import { DateTimePickerField } from './date-time-picker-field';

/** 모듈 상수 — bottom-sheet가 snapPoints 배열 참조로 재계산하므로 렌더마다 새로 만들지 않는다 */
const SNAP_POINTS = ['85%'];

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCalendarMemoDto) => void;
  onUpdate?: (data: UpdateCalendarMemoDto) => void;
  editData?: CalendarMemo | null;
  initialStartDate?: string;
  initialEndDate?: string;
}

export function CalendarAddModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editData,
  initialStartDate,
  initialEndDate,
}: CalendarAddModalProps) {
  // inputRef를 분리해야 컴파일러가 form 전체를 ref로 오인하지 않음
  const { inputRef, ...form } = useCalendarMemoForm({
    isOpen,
    editData,
    initialStartDate,
    initialEndDate,
    onSubmit,
    onUpdate,
    onClose,
  });

  return (
    <ControlledSheet
      scrollable
      background="surface"
      isOpen={isOpen}
      overlay={
        <View className="absolute bottom-36 left-0 right-0 items-end px-6" style={{ zIndex: 5 }}>
          <FloatingButton onPress={form.submit} />
        </View>
      }
      showsScrollIndicator={false}
      snapPoints={SNAP_POINTS}
      title={form.isEditMode ? '일정 수정' : '새 일정'}
      onClose={form.close}
    >
      {/* 제목과의 간격은 pt-4(기존 gap-4)로 유지 */}
      <View className="p-4 pb-6">
        <Form>
          <Form.Field required label="제목">
            <Input
              ref={inputRef}
              defaultValue={editData?.title}
              placeholder="일정 제목을 입력하세요"
              size="lg"
              onChangeText={form.changeTitle}
            />
          </Form.Field>

          <Switch checked={form.isAllDay} label="하루종일" onCheckedChange={form.changeAllDay} />

          <View className="gap-4">
            <DateTimePickerField
              activePicker={form.getFieldPicker('start')}
              dateTime={form.startDateTime}
              isAllDay={form.isAllDay}
              label="시작"
              onDateTimeChange={form.setStartDateTime}
              onPickerChange={(picker) => form.changeFieldPicker('start', picker)}
              onSyncDate={form.syncEndDate}
            />

            <DateTimePickerField
              activePicker={form.getFieldPicker('end')}
              dateTime={form.endDateTime}
              isAllDay={form.isAllDay}
              label="종료"
              minDate={form.endMinDate}
              onDateTimeChange={form.setEndDateTime}
              onPickerChange={(picker) => form.changeFieldPicker('end', picker)}
              onSyncDate={form.syncStartDate}
            />
          </View>

          <Animated.View layout={LinearTransition}>
            <Form.Field label="알림 설정">
              <Select
                options={form.notificationOptions}
                placeholder="알림 시점을 선택하세요"
                value={form.notifyBefore || 'NONE'}
                onValueChange={form.changeNotifyBefore}
              />
            </Form.Field>
          </Animated.View>
        </Form>
      </View>
    </ControlledSheet>
  );
}
