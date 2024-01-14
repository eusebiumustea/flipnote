import { Animated, GestureResponderEvent } from "react-native";

export interface HeaderProps {
  onSearch: (e: string) => void;
  searchValue: string;
  scrollY?: Animated.Value;
  extraHeight?: number;
  onInboxOpen?: (e: GestureResponderEvent) => void;
}
