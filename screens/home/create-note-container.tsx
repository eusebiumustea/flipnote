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

export function CreateNoteContainer({
  show,
  onHide,
  children,
}: CreateNoteProps) {
  const theme = useTheme();
  const { width, height } = Dimensions.get("window");
  const { top, bottom } = useSafeAreaInsets();
  useMemo(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      onHide();
      return true;
    });
    if (show === false) {
      back.remove();
      BackHandler.addEventListener("hardwareBackPress", () => {
        BackHandler.exitApp();
        return false;
      });
    }
  }, [show]);
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
            transition={{
              type: "timing",
              duration: 250,
              borderRadius: { duration: 300 },
              backgroundColor: { duration: 300 },
            }}
            from={{
              margin: moderateScale(25),
              width: moderateScale(65),
              height: moderateScale(65),
              backgroundColor: theme.onPrimary,
              borderRadius: 100,
              zIndex: 4,
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
            animate={{
              margin: 0,
              width: width,
              height: height,
              backgroundColor: theme.background,
              borderRadius: 0,
            }}
            exit={{
              margin: moderateScale(25),
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
                flex: 1,
                height: "100%",
                width: "100%",
              }}
              transition={{ delay: 250 }}
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
