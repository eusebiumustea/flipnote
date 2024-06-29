import { MotiProps } from "moti";
import { PropsWithChildren, ReactNode } from "react";
import { ViewStyle } from "react-native";
interface ButtonActionProps {
  title: string;
  onPress: () => void;
  hidden?: boolean;
  loading?: boolean;
}
export interface DialogProps {
  buttons: ButtonActionProps[];
  visible: boolean;
  onCancel: () => void;
  title: string;
  children: PropsWithChildren<ReactNode>;
  onPress?: () => void;
  animation?: "fade" | "none" | "slide";
  statusBarTranslucent?: boolean;
  styles?: ViewStyle;
  backgroundBlur?: boolean;
  buttonsContainerStyle?: ViewStyle;
  animate?: any;
}
