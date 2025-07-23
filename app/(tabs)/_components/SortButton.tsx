import { Button, Typography } from "@/components/ui";
import { SortOption } from "./types";

interface SortButtonProps {
  option: SortOption;
}

export const SortButton = ({ option }: SortButtonProps) => (
  <Button
    size="sm"
    variant={option.active ? undefined : "outlined"}
    chromeless={!option.active}
  >
    <Typography
      variant="caption"
      color={option.active ? "$textOnPrimary" : "$textSecondary"}
      fontWeight={option.active ? "$3" : "$2"}
    >
      {option.name}
    </Typography>
  </Button>
);