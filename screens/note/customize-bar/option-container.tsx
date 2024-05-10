import { AnimatePresence, MotiScrollView, MotiView } from "moti";
import { PropsWithChildren, ReactNode } from "react";
import { useTheme } from "../../../hooks";
import { ViewStyle } from "react-native";

type OptionContainerProps = {
  children: PropsWithChildren<ReactNode>;
  show: boolean;
  scroll?: boolean;
  style?: ViewStyle;
};
export function OptionContainer({
  show,
  children,
  scroll = true,
  style,
}: OptionContainerProps) {
  const theme = useTheme();
  if (!scroll) {
    return (
      <AnimatePresence>
        {show && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", delay: 180, duration: 120 }}
            exit={{ opacity: 0 }}
            exitTransition={{ delay: 0 }}
            style={{
              width: "100%",
              backgroundColor: theme.customizeBarColor,
              position: "absolute",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              top: 0,
              padding: 15,
              alignItems: "center",
              justifyContent: "center",
              ...style,
            }}
          >
            {children}
          </MotiView>
        )}
      </AnimatePresence>
    );
  }
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
            ...style,
          }}
        >
          {children}
        </MotiScrollView>
      )}
    </AnimatePresence>
  );
}
