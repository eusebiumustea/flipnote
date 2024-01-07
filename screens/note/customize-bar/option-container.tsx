import { AnimatePresence, MotiScrollView } from "moti";
import { PropsWithChildren, ReactNode } from "react";
import { useTheme } from "../../../hooks";

interface OptionContainerProps {
  children: PropsWithChildren<ReactNode>;
  show: boolean;
}
export function OptionContainer({ show, children }: OptionContainerProps) {
  const theme = useTheme();
  return (
    <AnimatePresence>
      {show && (
        <MotiScrollView
          horizontal
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", delay: 180, duration: 120 }}
          exit={{ opacity: 0 }}
          exitTransition={{ delay: 0 }}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 15,
            padding: 15,
          }}
          style={{
            width: "100%",
            backgroundColor: theme.customizeBarColor,
            position: "absolute",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            top: 0,
          }}
        >
          {children}
        </MotiScrollView>
      )}
    </AnimatePresence>
  );
}
