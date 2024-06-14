import { PropsWithChildren, ReactNode } from "react";
import { ViewStyle } from "react-native";
interface ButtonActionProps {
  title: string;
  onPress: () => void;
  hidden?: boolean;
}
export interface DialogProps {
  buttons: ButtonActionProps[];
  visible: boolean;
  onCencel: () => void;
  title: string;
  children: PropsWithChildren<ReactNode>;

  animation?: "fade" | "none" | "slide";
  statusBarTranslucent?: boolean;
  styles?: ViewStyle;
  backgroundBlur?: boolean;
  buttonsContainerStyle?: ViewStyle;
}
