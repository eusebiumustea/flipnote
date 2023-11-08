import { AnimatePresence, MotiView } from "moti";
import { ReactNode } from "react";
import { ViewStyle } from "react-native";
import { useTheme } from "../../tools";
interface FadeViewProps {
  children?: ReactNode;
  style?: ViewStyle;
  duration?: number;
}
export const FadeView = ({
  children,
  style,
  duration = 180,
}: FadeViewProps) => {
  const theme = useTheme();
  return (
    <AnimatePresence>
      <MotiView
        style={style}
        transition={{ type: "timing", duration: duration }}
        from={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
      >
        {children}
      </MotiView>
    </AnimatePresence>
  );
};
