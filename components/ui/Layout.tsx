import { YStack, styled } from 'tamagui';

export const Screen = styled(YStack, {
  flex: 1,
  backgroundColor: '$background',
  padding: '$6',
});

export const Card = styled(YStack, {
  backgroundColor: '$surface',
  borderColor: '$border',
  borderWidth: 1,
  borderRadius: '$4',
  padding: '$4',
});

export const Logo = styled(YStack, {
  width: 60,
  height: 60,
  backgroundColor: '$primary',
  borderRadius: '$6',
  justifyContent: 'center',
  alignItems: 'center',
});
