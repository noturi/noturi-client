import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { formatDateString } from '~/entities/todo/lib/date-utils';
import { CreateRecurrenceType } from '~/entities/todo/model/types';
import { useToast } from '~/shared/lib';
import { Button, Card, Form, Input, TextArea, Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useCreateTodoMutation } from '../api/mutations';

interface TodoCreateFormProps {
  initialDate?: Date;
  onSuccess?: () => void;
}

const RECURRENCE_OPTIONS: { type: CreateRecurrenceType; label: string }[] = [
  { type: 'NONE', label: '반복 안함' },
  { type: 'DAILY', label: '매일' },
  { type: 'WEEKLY', label: '매주' },
  { type: 'MONTHLY', label: '매월' },
];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function TodoCreateForm({ initialDate = new Date(), onSuccess }: TodoCreateFormProps) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date] = useState(initialDate);
  const [recurrenceType, setRecurrenceType] = useState<CreateRecurrenceType>('NONE');
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);

  const createTodoMutation = useCreateTodoMutation({
    onSuccess: () => {
      toast.showSuccess('투두가 생성되었습니다');
      onSuccess?.();
    },
    onError: () => {
      toast.showError('투두 생성에 실패했습니다');
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) return;

    createTodoMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      date: formatDateString(date),
      recurrenceType,
      recurrenceDays: recurrenceType === 'WEEKLY' ? recurrenceDays : undefined,
    });
  };

  const toggleWeekday = (day: number) => {
    setRecurrenceDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const isValid =
    title.trim().length > 0 && (recurrenceType !== 'WEEKLY' || recurrenceDays.length > 0);

  return (
    <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
      <View className="gap-4">
        <Card>
          <View className="gap-4">
            <Form.Field required label="제목">
              <Input
                maxLength={100}
                placeholder="할 일을 입력하세요"
                size="lg"
                value={title}
                onChangeText={setTitle}
              />
            </Form.Field>

            <Form.Field label="설명">
              <TextArea
                minHeight={80}
                placeholder="상세 설명 (선택)"
                value={description}
                onChangeText={setDescription}
              />
            </Form.Field>

            <Form.Field label="날짜">
              <View className="rounded-3 bg-bg-secondary px-3 py-2">
                <Typography variant="body">
                  {format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
                </Typography>
              </View>
            </Form.Field>
          </View>
        </Card>

        <Card>
          <View className="gap-3">
            <Typography variant="headline">반복 설정</Typography>
            <View className="flex-row flex-wrap gap-2">
              {RECURRENCE_OPTIONS.map((option) => (
                <Pressable
                  key={option.type}
                  className={`rounded-2 px-4 py-2 ${
                    recurrenceType === option.type ? 'bg-primary' : 'bg-bg-secondary'
                  }`}
                  onPress={() => setRecurrenceType(option.type)}
                >
                  <Typography
                    className={
                      recurrenceType === option.type ? 'text-primary-text' : 'text-text-primary'
                    }
                    variant="callout"
                  >
                    {option.label}
                  </Typography>
                </Pressable>
              ))}
            </View>

            {recurrenceType === 'WEEKLY' && (
              <View className="gap-2">
                <Typography className="text-text-secondary" variant="footnote">
                  반복할 요일을 선택하세요
                </Typography>
                <View className="flex-row gap-2">
                  {WEEKDAYS.map((day, index) => (
                    <Pressable
                      key={day}
                      className={`h-10 w-10 items-center justify-center rounded-full ${
                        recurrenceDays.includes(index) ? 'bg-primary' : 'bg-bg-secondary'
                      }`}
                      onPress={() => toggleWeekday(index)}
                    >
                      <Typography
                        className={
                          recurrenceDays.includes(index) ? 'text-primary-text' : 'text-text-primary'
                        }
                        variant="callout"
                      >
                        {day}
                      </Typography>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Card>

        <Button
          isDisabled={!isValid}
          isLoading={createTodoMutation.isPending}
          variant="primary"
          onPress={handleSubmit}
        >
          <Button.Label>투두 생성</Button.Label>
        </Button>
      </View>
    </ScrollView>
  );
}
