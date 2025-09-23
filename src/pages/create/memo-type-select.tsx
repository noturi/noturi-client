import { MemoTypeSelectSheet } from '~/features/memo/ui/MemoTypeSelectSheet';

import { useState } from 'react';
import { View } from 'react-native';

export default function MemoTypeSelectScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  const handleClose = () => {
    setIsSheetOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <MemoTypeSelectSheet isOpen={isSheetOpen} onClose={handleClose} />
    </View>
  );
}
