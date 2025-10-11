import { z } from 'zod';

import { useCallback, useMemo, useReducer } from 'react';

export type FormFieldError = {
  message: string;
  type?: string;
};

export type FormState<T extends Record<string, any>> = {
  values: T;
  errors: Partial<Record<keyof T, FormFieldError>>;
  touched: Partial<Record<keyof T, boolean>>;
  isDirty: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};

type FormAction<T extends Record<string, any>> =
  | { type: 'SET_VALUE'; name: keyof T; value: T[keyof T] }
  | { type: 'SET_ERROR'; name: keyof T; error: FormFieldError }
  | { type: 'CLEAR_ERROR'; name: keyof T }
  | { type: 'SET_TOUCHED'; name: keyof T }
  | { type: 'SET_SUBMITTED'; value: boolean }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'RESET'; values: T }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, FormFieldError>> };

function formReducer<T extends Record<string, any>>(
  state: FormState<T>,
  action: FormAction<T>,
): FormState<T> {
  switch (action.type) {
    case 'SET_VALUE': {
      const newValues = { ...state.values, [action.name]: action.value };
      return {
        ...state,
        values: newValues,
        isDirty: true,
      };
    }
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.name]: action.error },
        isValid: false,
      };
    case 'CLEAR_ERROR': {
      const newErrors = { ...state.errors };
      delete newErrors[action.name];
      const hasErrors = Object.keys(newErrors).length > 0;
      return {
        ...state,
        errors: newErrors,
        isValid: !hasErrors,
      };
    }
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.name]: true },
      };
    case 'SET_SUBMITTED':
      return {
        ...state,
        isSubmitted: action.value,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.value,
      };
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
    case 'SET_ERRORS': {
      const hasErrors = Object.keys(action.errors).length > 0;
      return {
        ...state,
        errors: action.errors,
        isValid: !hasErrors,
      };
    }
    default:
      return state;
  }
}

export interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
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

  // 공통 validation 로직
  const parseZodErrors = useCallback(
    (zodError: z.ZodError): Partial<Record<keyof T, FormFieldError>> => {
      const errors: Partial<Record<keyof T, FormFieldError>> = {};
      zodError.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof T;
        if (fieldName) {
          errors[fieldName] = { message: issue.message, type: issue.code };
        }
      });
      return errors;
    },
    [],
  );

  const validateWithValues = useCallback(
    (values: T): { isValid: boolean; errors: Partial<Record<keyof T, FormFieldError>> } => {
      if (!validationSchema) return { isValid: true, errors: {} };

      try {
        validationSchema.parse(values);
        return { isValid: true, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { isValid: false, errors: parseZodErrors(error) };
        }
        return { isValid: false, errors: {} };
      }
    },
    [validationSchema, parseZodErrors],
  );

  const validateField = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      const updatedValues = { ...state.values, [name]: value };
      const { errors } = validateWithValues(updatedValues);

      const fieldError = errors[name];
      if (fieldError) {
        dispatch({ type: 'SET_ERROR', name, error: fieldError });
      } else {
        dispatch({ type: 'CLEAR_ERROR', name });
      }
    },
    [state.values, validateWithValues],
  );

  const validateAllFields = useCallback(() => {
    const { isValid, errors } = validateWithValues(state.values);
    dispatch({ type: 'SET_ERRORS', errors });
    return isValid;
  }, [state.values, validateWithValues]);

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      dispatch({ type: 'SET_VALUE', name, value });
      if (state.touched[name] || state.isSubmitted) {
        validateField(name, value);
      }
    },
    [state.touched, state.isSubmitted, validateField],
  );

  const setTouched = useCallback(
    <K extends keyof T>(name: K) => {
      dispatch({ type: 'SET_TOUCHED', name });
      validateField(name, state.values[name]);
    },
    [state.values, validateField],
  );

  const onValueChange = useCallback(
    <K extends keyof T>(event: { target: { name: K; value: T[K] } }) => {
      const { name, value } = event.target;
      setValue(name, value);
    },
    [setValue],
  );

  const handleSubmit = useCallback(async () => {
    if (!onSubmit) return;

    dispatch({ type: 'SET_SUBMITTED', value: true });
    dispatch({ type: 'SET_SUBMITTING', value: true });

    try {
      const isValid = validateAllFields();
      if (isValid) {
        await onSubmit(state.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  }, [onSubmit, state.values, validateAllFields]);

  const reset = useCallback(
    (values?: T) => {
      const resetValues = values || initialValues;
      dispatch({ type: 'RESET', values: resetValues });
    },
    [initialValues],
  );

  const getFieldProps = useCallback(
    <K extends keyof T>(name: K) => {
      return {
        name: name as string,
        value: state.values[name],
        error: state.errors[name],
        touched: state.touched[name],
        onChangeText: (value: T[K]) => setValue(name, value),
        onBlur: () => setTouched(name),
      };
    },
    [state.values, state.errors, state.touched, setValue, setTouched],
  );

  const shouldShowError = useCallback(
    <K extends keyof T>(name: K) => {
      return !!(state.errors[name] && (state.touched[name] || state.isSubmitted));
    },
    [state.errors, state.touched, state.isSubmitted],
  );

  const setError = useCallback(<K extends keyof T>(name: K, error: FormFieldError) => {
    dispatch({ type: 'SET_ERROR', name, error });
  }, []);

  const clearError = useCallback(<K extends keyof T>(name: K) => {
    dispatch({ type: 'CLEAR_ERROR', name });
  }, []);

  // 실시간으로 isValid 계산 (에러 표시와는 별개)
  const isValid = useMemo(() => {
    return validateWithValues(state.values).isValid;
  }, [validateWithValues, state.values]);

  const formProps = useMemo(
    () => ({
      ...state,
      isValid,
      setValue,
      setTouched,
      setError,
      clearError,
      onValueChange,
      handleSubmit,
      reset,
      getFieldProps,
      shouldShowError,
    }),
    [
      state,
      isValid,
      setValue,
      setTouched,
      setError,
      clearError,
      onValueChange,
      handleSubmit,
      reset,
      getFieldProps,
      shouldShowError,
    ],
  );

  return formProps;
}
