import { View, styled } from 'tamagui';

import React from 'react';

import type { FormFieldError } from '../../hooks/useForm';
import { Typography } from './Typography';

// Form Root Component
export interface FormProps {
  children: React.ReactNode;
  style?: React.ComponentProps<typeof View>['style'];
}

const FormRoot = styled(View, {
  gap: '$3',
  padding: '$4',
  flex: 1,
} as const);

// Form Field Component
export interface FormFieldProps {
  children: React.ReactNode;
  error?: FormFieldError;
  label?: string;
  required?: boolean;
}

const FormFieldWrapper = styled(View, {
  gap: '$2',
  flex: 1,
});

function FormField({ children, error, label, required }: FormFieldProps) {
  return (
    <FormFieldWrapper>
      {label && (
        <Typography variant="subtitle">
          {label}
          {required && (
            <Typography color="$error" variant="subtitle">
              *
            </Typography>
          )}
        </Typography>
      )}
      {children}
      {error && (
        <Typography color="$error" variant="subtitle">
          {error.message}
        </Typography>
      )}
    </FormFieldWrapper>
  );
}

// Form Label Component
export interface FormLabelProps extends React.ComponentProps<typeof Typography> {
  children: React.ReactNode;
  required?: boolean;
}

function FormLabel({ children, required, ...props }: FormLabelProps) {
  return (
    <Typography variant="subtitle" {...props}>
      {children}
      {required && (
        <Typography color="$error" variant="subtitle">
          *
        </Typography>
      )}
    </Typography>
  );
}

// Form Error Component
export interface FormErrorProps extends React.ComponentProps<typeof Typography> {
  children: React.ReactNode;
}

function FormError({ children, ...props }: FormErrorProps) {
  return (
    <Typography color="$error" marginTop="$1" variant="caption1" {...props}>
      {children}
    </Typography>
  );
}

export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Error: FormError,
});
