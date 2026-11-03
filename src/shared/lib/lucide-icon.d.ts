// metro.config.js의 개별 아이콘 경로 — 'lucide-react-native/icon/star' → dist/esm/icons/star.js
declare module 'lucide-react-native/icon/*' {
  import type { LucideIcon } from 'lucide-react-native';

  const Icon: LucideIcon;
  export default Icon;
}
