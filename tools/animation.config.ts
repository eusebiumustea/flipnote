import { MotiAnimationProp, MotiTransition, MotiTransitionProp } from "moti";
import { Easing } from "react-native-reanimated";
import * as Device from "expo-device";
import { Platform } from "react-native";
export const ram: number = Device.totalMemory / (1024 * 1024 * 1024);
export const deviceIsLowRam = Platform.OS === "android" && ram < 4;
export const animationConfig: MotiTransition = !deviceIsLowRam
  ? {
      type: "timing",
      easing: Easing.inOut(Easing.ease),
      duration: 350,
    }
  : {
      type: "timing",
      easing: Easing.ease,
      duration: 200,
    };
