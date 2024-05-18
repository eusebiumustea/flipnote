import { Animated } from "react-native";

export interface HeaderProps {
  onSearch: (e: string) => void;
  searchValue: string;
  scrollY: Animated.Value;
  onInboxOpen: () => void;
  onShowOptions: () => void;
}
