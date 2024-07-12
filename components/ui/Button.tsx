import { Button as TamaguiButton, styled } from "tamagui";

export const PrimaryButton = styled(TamaguiButton, {
  size: "$4",
  backgroundColor: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  pressStyle: {
    backgroundColor: "$surfaceHover",
    borderColor: "$borderHover",
  },
});
