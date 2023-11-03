import { AnimatePresence, MotiView } from "moti";
import { moderateScale, useTheme } from "../../tools";
import {
  TouchableOpacity,
  Text,
  Dimensions,
  Easing,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateNoteProps, EditNoteProps } from "./types";
import { useCallback, useEffect, useMemo } from "react";

export function EditNoteContainer({
  fromY,
  fromX,
  fromHeight,
  fromWidth,
  fromBg,
  show,
  children,
}: EditNoteProps) {
  const theme = useTheme();
  const { width, height } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  return (
    <AnimatePresence>
      {show && (
        <>
          <MotiView
            transition={{ duration: 300, type: "timing" }}
            from={{
              width: width,
              height: height,
              opacity: 0,
              backgroundColor: "#000",
              marginTop: top,
              zIndex: 4,
              position: "absolute",
            }}
            animate={{ opacity: 0.4 }}
            exit={{
              width: width,
              height: height,
              opacity: 0,
              backgroundColor: "#000",
              marginTop: top,
              zIndex: 4,
              position: "absolute",
            }}
          />
          <MotiView
            exitTransition={{ backgroundColor: { delay: 100, duration: 250 } }}
            transition={{
              type: "timing",
              duration: 250,
              backgroundColor: { duration: 200 },
            }}
            from={{
              translateX: fromX ? fromX : 0,
              translateY: fromY ? fromY : 0,
              width: fromWidth ? fromWidth : 0,
              height: fromHeight ? fromHeight : 0,
              backgroundColor: fromBg,
              borderRadius: 16,
              zIndex: 5,
              position: "absolute",
              marginTop: top,
            }}
            animate={{
              translateX: 0,
              translateY: 0,
              width: width,
              height: height,
              backgroundColor: theme.background,
              borderRadius: 0,
              zIndex: 5,
              position: "absolute",
            }}
            exit={{
              translateX: fromX ? fromX : 0,
              translateY: fromY ? fromY : 0,
              width: fromWidth ? fromWidth : 0,
              height: fromHeight ? fromHeight : 0,
              backgroundColor: fromBg,
              borderRadius: 16,
              zIndex: 5,
              position: "absolute",
            }}
          >
            <MotiView
              style={{
                height: "100%",
                width: "100%",
              }}
              transition={{ delay: 100 }}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              exitTransition={{ duration: 100, delay: 0 }}
            >
              {children}
            </MotiView>
          </MotiView>
        </>
      )}
    </AnimatePresence>
  );
}
