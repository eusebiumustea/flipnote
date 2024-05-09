import { Animated, GestureResponderEvent } from "react-native";

export interface HeaderProps {
  onSearch: (e: string) => void;
  searchValue: string;
  scrollY?: Animated.Value;
  onInboxOpen?: (e: GestureResponderEvent) => void;
}
