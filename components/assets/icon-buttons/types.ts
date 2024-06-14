import {
  ColorValue,
  GestureResponderEvent,
  PressableProps,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";
export type IconButtonBase<T = unknown> = {
  color?: ColorValue;
  active?: boolean;
  svgProps?: any;
  onPress?: (event: GestureResponderEvent) => void;
  btnProps?: TouchableOpacityProps;
  style?: ViewStyle;
  focused?: boolean;
} & T;
