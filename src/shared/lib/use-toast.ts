import * as Burnt from 'burnt';

export function useToast() {
  const showSuccess = (message: string) => {
    Burnt.toast({
      title: message,
      preset: 'done',
      layout: {
        iconSize: {
          height: 16,
          width: 16,
        },
      },
    });
  };

  const showError = (message: string) => {
    Burnt.toast({
      title: message,
      preset: 'error',
      layout: {
        iconSize: {
          height: 16,
          width: 16,
        },
      },
    });
  };

  return {
    showSuccess,
    showError,
  };
}
