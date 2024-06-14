import { AnimatePresence, MotiView } from "moti";
import { PropsWithChildren, ReactNode } from "react";
import { ViewStyle } from "react-native";
import { useTheme } from "../../../hooks";

type OptionContainerProps = {
  children: PropsWithChildren<ReactNode>;
  show: boolean;
  style?: ViewStyle;
};
export function OptionContainer({
  show,
  children,

  style,
}: OptionContainerProps) {
  const theme = useTheme();
  return (
    <AnimatePresence>
      {show && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", delay: 180, duration: 120 } as any}
          exit={{ opacity: 0 }}
          exitTransition={{ delay: 0 } as any}
          style={{
            backgroundColor: theme.customizeBarColor,
            position: "absolute",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            top: 0,
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            ...style,
          }}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
}
