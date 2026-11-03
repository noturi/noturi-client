/**
 * Lucide 아이콘에 NativeWind className 지원 추가
 *
 * 사용법:
 * import { Star, Calendar } from '~/shared/lib/icons';
 * <Star className="text-accent" size={16} />
 */
// 아이콘은 파일 하나씩 불러옴 — 'lucide-react-native' 루트를 import하면 Metro가 아이콘 3,300여 개(약 1.2MB)를
// 모두 번들에 넣는다. 'lucide-react-native/icon/<파일명>'은 metro.config.js에서 개별 아이콘 파일로 연결됨.
// 새 아이콘 추가: node_modules/lucide-react-native/dist/esm/icons에서 파일명 확인 (예: Home → house)
import Bell from 'lucide-react-native/icon/bell';
import Calendar from 'lucide-react-native/icon/calendar';
import BarChart3 from 'lucide-react-native/icon/chart-column';
import Check from 'lucide-react-native/icon/check';
import ChevronDown from 'lucide-react-native/icon/chevron-down';
import ChevronLeft from 'lucide-react-native/icon/chevron-left';
import ChevronRight from 'lucide-react-native/icon/chevron-right';
import ChevronUp from 'lucide-react-native/icon/chevron-up';
import MoreVertical from 'lucide-react-native/icon/ellipsis-vertical';
import ExternalLink from 'lucide-react-native/icon/external-link';
import FileText from 'lucide-react-native/icon/file-text';
import Filter from 'lucide-react-native/icon/funnel';
import GripVertical from 'lucide-react-native/icon/grip-vertical';
import Home from 'lucide-react-native/icon/house';
import Info from 'lucide-react-native/icon/info';
import ListChecks from 'lucide-react-native/icon/list-checks';
import LogOut from 'lucide-react-native/icon/log-out';
import Moon from 'lucide-react-native/icon/moon';
import Palette from 'lucide-react-native/icon/palette';
import Pencil from 'lucide-react-native/icon/pencil';
import Plus from 'lucide-react-native/icon/plus';
import Search from 'lucide-react-native/icon/search';
import Settings from 'lucide-react-native/icon/settings';
import Star from 'lucide-react-native/icon/star';
import Trash2 from 'lucide-react-native/icon/trash-2';
import User from 'lucide-react-native/icon/user';
import X from 'lucide-react-native/icon/x';
import { cssInterop } from 'nativewind';

// 모든 아이콘에 cssInterop 적용
const icons = [
  BarChart3,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileText,
  Filter,
  GripVertical,
  Home,
  Info,
  ListChecks,
  LogOut,
  Moon,
  MoreVertical,
  Palette,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  User,
  X,
];

icons.forEach((icon) => {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
      },
    },
  });
});

export {
  BarChart3,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileText,
  Filter,
  GripVertical,
  Home,
  Info,
  ListChecks,
  LogOut,
  Moon,
  MoreVertical,
  Palette,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  User,
  X,
};
