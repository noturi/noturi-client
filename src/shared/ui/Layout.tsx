import { YStack, styled } from 'tamagui';

export const Screen = styled(YStack, {
  flex: 1,
  backgroundColor: '$background',
  padding: '$6xl',
});

export const Card = styled(YStack, {
  backgroundColor: '$surface',
  borderColor: '$border',
  borderWidth: 1,
  borderRadius: '$2xl',
  padding: '$2xl',
});

export const Logo = styled(YStack, {
  width: 60,
  height: 60,
  backgroundColor: '$primary',
  borderRadius: '$xl',
  justifyContent: 'center',
  alignItems: 'center',
});
