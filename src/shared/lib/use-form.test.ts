import { z } from 'zod';

import { type FormState, formReducer, validateValues } from './use-form';

type Values = { name: string; age: number };

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  age: z.number().min(0, '0 이상'),
});
const validate = (values: Values) => validateValues(schema, values);

const initial = (values: Partial<Values> = {}): FormState<Values> => ({
  values: { name: '', age: 0, ...values },
  errors: {},
  touched: {},
  isDirty: false,
  isSubmitted: false,
  isValid: true,
  isSubmitting: false,
});

describe('validateValues', () => {
  it('스키마가 없으면 에러 없음', () => {
    expect(validateValues(undefined, { name: '' })).toEqual({});
  });

  it('필드별 첫 번째 에러만 수집', () => {
    expect(validateValues(schema, { name: '', age: -1 })).toEqual({
      name: { message: '이름을 입력해주세요', type: 'too_small' },
      age: { message: '0 이상', type: 'too_small' },
    });
  });
});

describe('formReducer', () => {
  it('touched 전에는 값 변경 시 에러를 표시하지 않는다', () => {
    const state = formReducer(initial(), { type: 'SET_VALUE', name: 'name', value: '', validate });
    expect(state.errors).toEqual({});
    expect(state.isDirty).toBe(true);
  });

  it('touched 후에는 값 변경 시 해당 필드를 즉시 검증한다', () => {
    let state = formReducer(initial(), { type: 'SET_TOUCHED', name: 'name', validate });
    expect(state.errors.name?.message).toBe('이름을 입력해주세요');

    state = formReducer(state, { type: 'SET_VALUE', name: 'name', value: '홍길동', validate });
    expect(state.errors.name).toBeUndefined();
    expect(state.isValid).toBe(true);
  });

  it('다른 필드의 에러는 건드리지 않는다', () => {
    let state = formReducer(initial({ age: -1 }), { type: 'SET_TOUCHED', name: 'age', validate });
    state = formReducer(state, { type: 'SET_TOUCHED', name: 'name', validate });
    state = formReducer(state, { type: 'SET_VALUE', name: 'name', value: '홍길동', validate });
    expect(Object.keys(state.errors)).toEqual(['age']);
  });

  it('제출 시작 시 전체 에러 반영 + submitted/submitting', () => {
    const state = formReducer(initial(), {
      type: 'SUBMIT_START',
      errors: validate(initial().values),
    });
    expect(state).toMatchObject({ isSubmitted: true, isSubmitting: true, isValid: false });
    expect(state.errors.name).toBeDefined();
    expect(formReducer(state, { type: 'SUBMIT_END' }).isSubmitting).toBe(false);
  });

  it('제출 후에는 touched가 아니어도 값 변경 시 검증한다', () => {
    let state = formReducer(initial(), { type: 'SUBMIT_START', errors: {} });
    state = formReducer(state, { type: 'SET_VALUE', name: 'name', value: '', validate });
    expect(state.errors.name).toBeDefined();
  });

  it('RESET은 값만 남기고 상태를 초기화한다', () => {
    const dirty = { ...initial(), touched: { name: true }, isSubmitted: true, isDirty: true };
    const state = formReducer(dirty, { type: 'RESET', values: { name: 'a', age: 1 } });
    expect(state).toMatchObject({
      values: { name: 'a', age: 1 },
      touched: {},
      isSubmitted: false,
      isDirty: false,
    });
  });
});
