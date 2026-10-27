import {
  ALL_DAY_NOTIFICATION_OPTIONS,
  type CalendarMemo,
  type CreateCalendarMemoDto,
  NOTIFICATION_OPTIONS,
  type NotifyBefore,
  type UpdateCalendarMemoDto,
} from '~/entities/calendar';
import { useToast } from '~/shared/lib';
import { getHoursLater } from '~/shared/lib/format';

import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import {
  fromCalendarMemo,
  getAllDayEndDateTime,
  getInitialDateRange,
  isCalendarMemoTitleValid,
  toActivePicker,
  toCalendarDateKey,
  toCalendarMemoDto,
  toFieldPicker,
  withTimeOf,
} from '../lib';
import type { ActivePicker, PickerField, PickerType } from './types';

interface UseCalendarMemoFormOptions {
  isOpen: boolean;
  /** 있으면 수정 모드, 없으면 생성 모드 */
  editData?: CalendarMemo | null;
  initialStartDate?: string;
  initialEndDate?: string;
  onSubmit: (data: CreateCalendarMemoDto) => void;
  onUpdate?: (data: UpdateCalendarMemoDto) => void;
  onClose: () => void;
}

/** 일정 생성/수정 폼의 상태·검증·저장 로직 (UI와 분리) */
export function useCalendarMemoForm({
  isOpen,
  editData,
  initialStartDate,
  initialEndDate,
  onSubmit,
  onUpdate,
  onClose,
}: UseCalendarMemoFormOptions) {
  const toast = useToast();

  /**
   * 제목은 비제어(uncontrolled) 입력으로 유지한다.
   * - 키 입력마다 시트 전체(캘린더/피커 포함)가 리렌더되지 않도록 state 대신 ref에 보관
   * - 한글 IME 조합 중 controlled value 재주입으로 인한 입력 깨짐 위험을 피함
   * 값은 이벤트 핸들러/이펙트에서만 읽고 쓴다 (렌더 중 접근 금지).
   */
  const titleRef = useRef('');
  const inputRef = useRef<TextInput>(null);

  const [startDateTime, setStartDateTime] = useState(() => new Date());
  const [endDateTime, setEndDateTime] = useState(() => getHoursLater(1));
  const [isAllDay, setIsAllDay] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState<NotifyBefore | undefined>(undefined);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const isEditMode = !!editData;
  const notificationOptions = isAllDay ? ALL_DAY_NOTIFICATION_OPTIONS : NOTIFICATION_OPTIONS;

  // 열릴 때 폼 초기화: 수정 모드는 기존 데이터, 생성 모드는 선택된 날짜 기준
  useEffect(() => {
    if (!isOpen) return;

    if (editData) {
      const values = fromCalendarMemo(editData);
      titleRef.current = values.title;
      inputRef.current?.setNativeProps({ text: values.title });
      setStartDateTime(values.startDateTime);
      setEndDateTime(values.endDateTime);
      setIsAllDay(values.isAllDay);
      setNotifyBefore(values.notifyBefore);
    } else if (initialStartDate) {
      const range = getInitialDateRange(initialStartDate, initialEndDate);
      setStartDateTime(range.startDateTime);
      setEndDateTime(range.endDateTime);
    }
  }, [isOpen, editData, initialStartDate, initialEndDate]);

  const resetForm = () => {
    titleRef.current = '';
    inputRef.current?.clear();
    setStartDateTime(new Date());
    setEndDateTime(getHoursLater(1));
    setIsAllDay(false);
    setNotifyBefore(undefined);
    setActivePicker(null);
  };

  const close = () => {
    resetForm();
    onClose();
  };

  const changeTitle = (text: string) => {
    titleRef.current = text;
  };

  const changeAllDay = (checked: boolean) => {
    setIsAllDay(checked);
    setNotifyBefore(undefined);
    if (checked) {
      setEndDateTime(getAllDayEndDateTime(startDateTime));
    }
  };

  const changeNotifyBefore = (value: string) => {
    setNotifyBefore(value === 'NONE' ? undefined : (value as NotifyBefore));
  };

  const getFieldPicker = (field: PickerField) => toFieldPicker(activePicker, field);

  const changeFieldPicker = (field: PickerField, picker: PickerType) => {
    setActivePicker(toActivePicker(field, picker));
  };

  // 하루종일 모드에서 한쪽 날짜를 고르면 다른 쪽 날짜도 맞춘다 (시/분은 유지)
  const syncEndDate = (date: Date) => {
    setEndDateTime(withTimeOf(date, endDateTime));
  };

  const syncStartDate = (date: Date) => {
    setStartDateTime(withTimeOf(date, startDateTime));
  };

  const submit = () => {
    if (!isCalendarMemoTitleValid(titleRef.current)) return;

    const dto = toCalendarMemoDto({
      title: titleRef.current,
      startDateTime,
      endDateTime,
      isAllDay,
      notifyBefore,
    });

    if (editData && onUpdate) {
      onUpdate({ ...dto, id: editData.id });
    } else {
      onSubmit(dto);
    }

    toast.showSuccess(isEditMode ? '일정이 수정되었습니다' : '일정이 추가되었습니다');
    close();
  };

  return {
    inputRef,
    isEditMode,
    startDateTime,
    endDateTime,
    isAllDay,
    notifyBefore,
    notificationOptions,
    /** 종료 날짜 선택 하한 (하루종일이면 제한 없음) */
    endMinDate: isAllDay ? undefined : toCalendarDateKey(startDateTime),
    setStartDateTime,
    setEndDateTime,
    changeTitle,
    changeAllDay,
    changeNotifyBefore,
    getFieldPicker,
    changeFieldPicker,
    syncStartDate,
    syncEndDate,
    submit,
    close,
  };
}
