import * as Device from "expo-device";
import { Platform } from "react-native";
export const ram: number = Math.round(
  Device.totalMemory / (1024 * 1024 * 1024)
);

export const contentLengthLimit = () => {
  if (ram <= 2) {
    return 40000;
  }
  if (ram <= 3) {
    return 60000;
  }
  if (ram <= 4) {
    return 100000;
  }
  if (ram <= 6) {
    return 200000;
  }
  if (ram <= 8) {
    return 400000;
  }
  if (ram <= 12) {
    return 800000;
  }
};
export const deviceIsLowRam = Platform.OS === "android" && ram < 4;
export function renderDelay() {
  if (Platform.OS === "ios") {
    return 300;
  }
  if (deviceIsLowRam) {
    return 350;
  }
  return 270;
}
