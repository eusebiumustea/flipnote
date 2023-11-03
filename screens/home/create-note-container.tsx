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
import { CreateNoteProps } from "./types";
import { useCallback, useEffect, useMemo } from "react";

export function CreateNoteContainer({ show, children }: CreateNoteProps) {
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
              zIndex: 3,
              position: "absolute",
            }}
            animate={{ opacity: 0.4 }}
            exit={{
              width: width,
              height: height,
              opacity: 0,
              backgroundColor: "#000",
              marginTop: top,
              zIndex: 3,
              position: "absolute",
            }}
          />
          <MotiView
            exitTransition={{ backgroundColor: { delay: 100, duration: 250 } }}
            transition={{
              type: "timing",
              duration: 250,
              borderRadius: { duration: 300 },
              backgroundColor: { duration: 200 },
            }}
            from={{
              margin: 25,
              width: moderateScale(61),
              height: moderateScale(61),
              backgroundColor: theme.onPrimary,
              borderRadius: 100,
              zIndex: 4,
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
            animate={{
              margin: 0,
              flex: 1,
              width: width,
              height: height,
              backgroundColor: theme.background,
              borderRadius: 0,
              zIndex: 4,
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
            exit={{
              margin: 25,
              width: moderateScale(61),
              height: moderateScale(61),
              backgroundColor: theme.onPrimary,
              borderRadius: 100,
              zIndex: 4,
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            <MotiView
              style={{
                height: "100%",
                width: "100%",
              }}
              transition={{ delay: 250 }}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              exitTransition={{ duration: 300, delay: 0 }}
            >
              {children}
            </MotiView>
          </MotiView>
        </>
      )}
    </AnimatePresence>
  );
}
