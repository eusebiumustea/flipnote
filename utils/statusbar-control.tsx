import { StatusBar } from "expo-status-bar";
import { useTheme } from "../hooks/theme-context";

export function StatusBarController() {
  const theme = useTheme();
  return <StatusBar backgroundColor={`${theme.background}`} style="auto" />;
}
