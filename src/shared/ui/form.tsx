import type { FormFieldError } from '~/shared/lib/use-form';

import React from 'react';
import { View, ViewProps } from 'react-native';

import { Typography } from './typography';

// Form Root Component
export interface FormProps extends ViewProps {
  children: React.ReactNode;
}

function FormRoot({ children, className, ...props }: FormProps) {
  return (
    <View className={`gap-4 ${className ?? ''}`} {...props}>
      {children}
    </View>
  );
}

// Form Field Component
export interface FormFieldProps {
  children: React.ReactNode;
  error?: FormFieldError;
  label?: string;
  required?: boolean;
}

function FormField({ children, error, label, required }: FormFieldProps) {
  return (
    <View className="gap-2">
      {label && (
        <Typography variant="footnote">
          {label}
          {required && (
            <Typography className="text-error" variant="footnote">
              *
            </Typography>
          )}
        </Typography>
      )}
      {children}
      {error && <FormError>{error.message}</FormError>}
    </View>
  );
}

// Form Label Component
export interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

function FormLabel({ children, required, className }: FormLabelProps) {
  return (
    <Typography className={className} variant="footnote">
      {children}
      {required && (
        <Typography className="text-error" variant="footnote">
          *
        </Typography>
      )}
    </Typography>
  );
}

// Form Error Component
export interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

function FormError({ children, className }: FormErrorProps) {
  return (
    <Typography className={`text-error mt-1 ${className ?? ''}`} variant="caption2">
      {children}
    </Typography>
  );
}

export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Error: FormError,
});
