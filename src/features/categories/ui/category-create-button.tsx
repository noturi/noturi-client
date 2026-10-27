import { toast } from 'sonner-native';
import { Button } from '~/shared/ui';

import { useCreateCategoryMutation } from '../api/mutations';

interface CategoryCreateButtonProps {
  name: string;
  isValid: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function CategoryCreateButton({
  name,
  isValid,
  onSuccess,
  onError,
}: CategoryCreateButtonProps) {
  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: () => {
      toast.success('카테고리가 추가되었습니다');
      onSuccess?.();
    },
    onError,
  });

  const handlePress = () => {
    createCategoryMutation.mutate({
      name: name.trim(),
      color: '#0e0f0f',
    });
  };

  return (
    <Button
      isDisabled={!isValid || createCategoryMutation.isPending}
      size="sm"
      variant="primary"
      onPress={handlePress}
    >
      <Button.Label>추가</Button.Label>
    </Button>
  );
}
