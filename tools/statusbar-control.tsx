import { StatusBar } from "expo-status-bar";
import { useTheme } from "./theme-context";

export function StatusBarController() {
  const theme = useTheme();

  return <StatusBar backgroundColor={`${theme.background}`} style="auto" />;
}
