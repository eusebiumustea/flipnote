import { TextStyle, ViewStyle } from "react-native";
import { dark, light } from "../tools/colors";
import { useTheme } from "./theme-context";

export type CustomStyle<T, V, K extends (props: V) => ViewStyle | TextStyle> = (
  theme: typeof dark | typeof light
) => Record<keyof T, K>;

export function useStyle<T, V, K extends (props: V) => ViewStyle | TextStyle>(
  style: CustomStyle<T, V, K>
) {
  const theme = useTheme();
  return style(theme);
}
