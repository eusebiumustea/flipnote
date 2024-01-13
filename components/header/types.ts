import { Animated } from "react-native";

export interface HeaderProps {
  onSearch: (e: string) => void;
  searchValue: string;
  scrollY?: Animated.Value;
  extraHeight?: number;
  onInboxOpen?: () => void;
  show: boolean;
}
