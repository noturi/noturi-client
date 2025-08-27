import type { YStackProps } from 'tamagui';
import { YStack, styled } from 'tamagui';

const StyledCard = styled(YStack, {
  backgroundColor: '$backgroundPrimary',
  borderRadius: '$2xl',
  padding: '$md',
});

export interface CardProps extends YStackProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return <StyledCard {...props}>{children}</StyledCard>;
}
