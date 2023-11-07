import { AnimatePresence, MotiView } from "moti";
import { ReactNode } from "react";
import { ViewStyle } from "react-native";
import { useTheme } from "../../tools";
interface FadeViewProps {
  children?: ReactNode;
  style?: ViewStyle;
}
export const FadeView = ({ children, style }: FadeViewProps) => {
  const theme = useTheme();
  return (
    <AnimatePresence>
      <MotiView
        style={style}
        transition={{ type: "timing", duration: 160 }}
        from={{
          backgroundColor: theme.background,
          opacity: 0,
        }}
        animate={{ opacity: 1, translateX: 0 }}
      >
        {children}
      </MotiView>
    </AnimatePresence>
  );
};
