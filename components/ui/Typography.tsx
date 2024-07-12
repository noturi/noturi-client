import { Text as TamaguiText, styled } from "tamagui";

export const Title = styled(TamaguiText, {
  fontSize: "$4",
  fontWeight: "700",
  color: "$textPrimary",
  textAlign: "center",
});

export const Subtitle = styled(TamaguiText, {
  fontSize: "$2",
  color: "$textSecondary",
  textAlign: "center",
  lineHeight: 18,
});

export const Caption = styled(TamaguiText, {
  fontSize: "$1",
  color: "$textMuted",
  textAlign: "center",
  lineHeight: 16,
});

export const ButtonText = styled(TamaguiText, {
  fontSize: "$2",
  fontWeight: "600",
  color: "$textPrimary",
});
