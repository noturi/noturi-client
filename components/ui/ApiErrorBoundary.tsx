import React, { Component, ReactNode } from "react";
import { YStack } from "tamagui";
import { Button } from "./Button";
import { Typography } from "./Typography";

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
    console.error("ApiErrorBoundary caught an error:", error, errorInfo);
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
        this.state.error?.message?.includes("Network request failed") ||
        this.state.error?.message?.includes(
          "카테고리 목록을 불러오는데 실패했습니다"
        );

      return (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$4"
          backgroundColor="$backgroundPrimary"
          gap="$4"
        >
          <Typography
            fontSize="$6"
            fontWeight="600"
            color="$textPrimary"
            textAlign="center"
          >
            {isNetworkError ? "서버 연결 실패" : "오류가 발생했습니다"}
          </Typography>

          <Typography
            fontSize="$4"
            color="$textMuted"
            textAlign="center"
            maxWidth={300}
          >
            {isNetworkError
              ? "서버에 연결할 수 없습니다.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요."
              : "예상치 못한 오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}
          </Typography>

          <Button onPress={this.handleRetry} variant="outlined">
            <Typography color="white" fontWeight="600">
              다시 시도
            </Typography>
          </Button>
        </YStack>
      );
    }

    return this.props.children;
  }
}
