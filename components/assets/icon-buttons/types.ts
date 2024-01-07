import {
  ColorValue,
  GestureResponderEvent,
  TouchableOpacityProps,
  ViewProps,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

export type IconButtonBase<T = unknown> = {
  color?: ColorValue;
  active?: boolean;
  svgProps?: any;
  onPress?: (event: GestureResponderEvent) => void;
  btnProps?: TouchableOpacityProps;
  style?: ViewStyle;
  focused?: boolean;
} & T;
