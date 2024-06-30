import { KeyboardAvoidingView } from "react-native";
import Animated from "react-native-reanimated";
import ViewShot from "react-native-view-shot";

export const ReanimatedView = Animated.View;
export const ReanimatedViewShot = Animated.createAnimatedComponent(ViewShot);
export const ReanimatedKeyboardAvoidingView =
  Animated.createAnimatedComponent(KeyboardAvoidingView);
