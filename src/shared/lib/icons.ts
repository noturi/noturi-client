/**
 * Lucide 아이콘에 NativeWind className 지원 추가
 *
 * 사용법:
 * import { Star, Calendar } from '~/shared/lib/icons';
 * <Star className="text-accent" size={16} />
 */
import {
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
  Info,
  LogOut,
  MoreVertical,
  Palette,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  User,
  X,
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';

// 모든 아이콘에 cssInterop 적용
const icons = [
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
  Info,
  LogOut,
  MoreVertical,
  Palette,
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
  Info,
  LogOut,
  MoreVertical,
  Palette,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  User,
  X,
};
