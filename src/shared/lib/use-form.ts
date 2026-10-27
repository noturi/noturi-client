import { z } from 'zod';

import { useReducer } from 'react';

import Logger from './logger';

export type FormFieldError = {
  message: string;
  type?: string;
};

type FieldErrors<T> = Partial<Record<keyof T, FormFieldError>>;

export type FormState<T extends Record<string, unknown>> = {
  values: T;
  errors: FieldErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isDirty: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};

type Validate<T> = (values: T) => FieldErrors<T>;

type FormAction<T extends Record<string, unknown>> =
  | { type: 'SET_VALUE'; name: keyof T; value: T[keyof T]; validate: Validate<T> }
  | { type: 'SET_TOUCHED'; name: keyof T; validate: Validate<T> }
  | { type: 'SET_ERROR'; name: keyof T; error: FormFieldError }
  | { type: 'CLEAR_ERROR'; name: keyof T }
  | { type: 'SUBMIT_START'; errors: FieldErrors<T> }
  | { type: 'SUBMIT_END' }
  | { type: 'RESET'; values: T };

const hasErrors = (errors: object) => Object.keys(errors).length > 0;

/** 한 필드의 검증 결과만 errors에 반영 */
function withFieldError<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
  name: keyof T,
  fieldError: FormFieldError | undefined,
): FieldErrors<T> {
  const next = { ...errors };
  if (fieldError) next[name] = fieldError;
  else delete next[name];
  return next;
}

// 검증을 reducer 안에서 수행 → setValue/setTouched가 최신 state에 의존하지 않아 참조가 안정적
export function formReducer<T extends Record<string, unknown>>(
  state: FormState<T>,
  action: FormAction<T>,
): FormState<T> {
  switch (action.type) {
    case 'SET_VALUE': {
      const values = { ...state.values, [action.name]: action.value };
      const shouldValidate = state.touched[action.name] || state.isSubmitted;
      const errors = shouldValidate
        ? withFieldError(state.errors, action.name, action.validate(values)[action.name])
        : state.errors;
      return { ...state, values, errors, isDirty: true, isValid: !hasErrors(errors) };
    }
    case 'SET_TOUCHED': {
      const fieldError = action.validate(state.values)[action.name];
      const errors = withFieldError(state.errors, action.name, fieldError);
      return {
        ...state,
        touched: { ...state.touched, [action.name]: true },
        errors,
        isValid: !hasErrors(errors),
      };
    }
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.name]: action.error },
        isValid: false,
      };
    case 'CLEAR_ERROR': {
      const errors = withFieldError(state.errors, action.name, undefined);
      return { ...state, errors, isValid: !hasErrors(errors) };
    }
    case 'SUBMIT_START':
      return {
        ...state,
        errors: action.errors,
        isValid: !hasErrors(action.errors),
        isSubmitted: true,
        isSubmitting: true,
      };
    case 'SUBMIT_END':
      return { ...state, isSubmitting: false };
    case 'RESET':
      return {
        values: action.values,
        errors: {},
        touched: {},
        isDirty: false,
        isSubmitted: false,
        isValid: false,
        isSubmitting: false,
      };
    default:
      return state;
  }
}

export function validateValues<T extends Record<string, unknown>>(
  schema: z.ZodType<T> | undefined,
  values: T,
): FieldErrors<T> {
  if (!schema) return {};
  const result = schema.safeParse(values);
  if (result.success) return {};

  const errors: FieldErrors<T> = {};
  for (const issue of result.error.issues) {
    const fieldName = issue.path[0] as keyof T | undefined;
    if (fieldName !== undefined && !errors[fieldName]) {
      errors[fieldName] = { message: issue.message, type: issue.code };
    }
  }
  return errors;
}

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema?: z.ZodType<T>;
  onSubmit?: (values: T) => Promise<void> | void;
}

// 메모이제이션은 React Compiler가 담당 (수동 useCallback/useMemo 없음)
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {},
    touched: {},
    isDirty: false,
    isSubmitted: false,
    isValid: true,
    isSubmitting: false,
  });

  const validate: Validate<T> = (values) => validateValues(validationSchema, values);

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    dispatch({ type: 'SET_VALUE', name, value, validate });
  };

  const setTouched = <K extends keyof T>(name: K) => {
    dispatch({ type: 'SET_TOUCHED', name, validate });
  };

  const setError = <K extends keyof T>(name: K, error: FormFieldError) => {
    dispatch({ type: 'SET_ERROR', name, error });
  };

  const clearError = <K extends keyof T>(name: K) => {
    dispatch({ type: 'CLEAR_ERROR', name });
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;

    const errors = validate(state.values);
    dispatch({ type: 'SUBMIT_START', errors });

    if (!hasErrors(errors)) {
      await Promise.resolve()
        .then(() => onSubmit(state.values))
        .catch((error: unknown) => Logger.error('Form submission error:', error));
    }
    dispatch({ type: 'SUBMIT_END' });
  };

  const reset = (values?: T) => {
    dispatch({ type: 'RESET', values: values || initialValues });
  };

  const shouldShowError = <K extends keyof T>(name: K) =>
    !!(state.errors[name] && (state.touched[name] || state.isSubmitted));

  // 실시간 유효성 (에러 표시와는 별개)
  const isValid = !hasErrors(validate(state.values));

  return {
    ...state,
    isValid,
    setValue,
    setTouched,
    setError,
    clearError,
    handleSubmit,
    reset,
    shouldShowError,
  };
}
