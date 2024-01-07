import * as Device from "expo-device";
import { Platform } from "react-native";
export const ram: number = Device.totalMemory / (1024 * 1024 * 1024);

export const deviceIsLowRam = Platform.OS === "android" && ram < 4;
