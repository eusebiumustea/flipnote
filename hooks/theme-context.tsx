import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { dark, light } from "../tools/colors";

const ThemeContext = createContext(light);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  const deviceTheme = useMemo(() => {
    if (colorScheme === "dark") {
      return dark;
    }
    if (colorScheme === "light") {
      return light;
    }
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={deviceTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
