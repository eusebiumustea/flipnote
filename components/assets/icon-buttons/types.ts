import {
  ColorValue,
  GestureResponderEvent,
  PressableProps,
  ViewStyle,
} from "react-native";

export type IconButtonBase<T = unknown> = {
  color?: ColorValue;
  active?: boolean;
  svgProps?: any;
  onPress?: (event: GestureResponderEvent) => void;
  btnProps?: PressableProps;
  style?: ViewStyle;
  focused?: boolean;
} & T;
