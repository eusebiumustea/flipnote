import {
  ColorValue,
  GestureResponderEvent,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type IconButtonBase<T = unknown> = {
  color?: ColorValue;
  active?: boolean;
  svgProps?: any;
  onPress?: (event: GestureResponderEvent) => void;
  btnProps?: TouchableOpacityProps;
  style?: ViewStyle;
  focused?: boolean;
} & T;
