import { ViewStyle } from "react-native";

export interface ScreenProps {
  open: boolean;
  onClose: () => void;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  exitTransition?: unknown;
  containerStyle?: ViewStyle;
  overlay?: boolean;
}
