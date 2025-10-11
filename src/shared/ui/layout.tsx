import { YStack, styled } from 'tamagui';

export const Screen = styled(YStack, {
  flex: 1,
  backgroundColor: '$background',
  padding: '$10',
});

export const Card = styled(YStack, {
  backgroundColor: '$surface',
  borderColor: '$border',
  borderWidth: 1,
  borderRadius: '$6',
  padding: '$6',
});

export const Logo = styled(YStack, {
  width: 60,
  height: 60,
  backgroundColor: '$primary',
  borderRadius: '$5',
  justifyContent: 'center',
  alignItems: 'center',
});
