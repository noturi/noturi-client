import { SizableText, View, styled } from 'tamagui';
import type { FormFieldError } from '~/shared/lib/useForm';

import React from 'react';

import { Typography } from './Typography';

// Form Root Component
export interface FormProps {
  children: React.ReactNode;
  style?: React.ComponentProps<typeof View>['style'];
}

const FormRoot = styled(View, {
  gap: '$4',
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
      {error && <FormError>{error.message}</FormError>}
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
        <SizableText color="$error" fontSize="$4" fontWeight="$4">
          *
        </SizableText>
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
    <Typography color="$error" marginTop="$1" variant="caption2" {...props}>
      {children}
    </Typography>
  );
}

export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Error: FormError,
});
