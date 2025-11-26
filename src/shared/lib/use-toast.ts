import * as Burnt from 'burnt';

export function useToast() {
  const showSuccess = (message: string) => {
    Burnt.toast({
      title: message,
      preset: 'done',
      haptic: 'success',
      duration: 2,
      layout: {
        iconSize: {
          height: 18,
          width: 18,
        },
      },
    });
  };

  const showError = (message: string) => {
    Burnt.toast({
      title: message,
      preset: 'error',
      haptic: 'error',
      duration: 2.5,
      layout: {
        iconSize: {
          height: 18,
          width: 18,
        },
      },
    });
  };

  return {
    showSuccess,
    showError,
  };
}
