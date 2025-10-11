import { YStack } from 'tamagui';

import React, { Component, ReactNode } from 'react';

import { Button } from './button';
import { Typography } from './typography';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ApiErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError =
        this.state.error?.message?.includes('Network request failed') ||
        this.state.error?.message?.includes('카테고리 목록을 불러오는데 실패했습니다');

      return (
        <YStack
          alignItems="center"
          backgroundColor="$backgroundPrimary"
          flex={1}
          gap="$3"
          justifyContent="center"
          padding="$3"
        >
          <Typography color="$textPrimary" fontSize="$5" fontWeight="$5" textAlign="center">
            {isNetworkError ? '서버 연결 실패' : '오류가 발생했습니다'}
          </Typography>

          <Typography color="$textMuted" fontSize="$3" maxWidth={300} textAlign="center">
            {isNetworkError
              ? '서버에 연결할 수 없습니다.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'
              : '예상치 못한 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'}
          </Typography>

          <Button variant="outlined" onPress={this.handleRetry}>
            <Typography color="white" fontWeight="$5">
              다시 시도
            </Typography>
          </Button>
        </YStack>
      );
    }

    return this.props.children;
  }
}
