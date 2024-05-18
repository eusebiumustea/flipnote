import { AnimatePresence, MotiView } from "moti";
import { useEffect } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImportIcon } from "../../../components";
import { useTheme } from "../../../hooks";
import { verticalScale } from "../../../utils";
import { OptionItem, OptionItemProps } from "./option-item";
import { useStorageUtils } from "../../../hooks/use-storage-utils";
interface OptionsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function OptionsOverlay({ open, onClose }: OptionsOverlayProps) {
  const { importNotes } = useStorageUtils();
  const OptionsItems: OptionItemProps[] = [
    {
      label: "Import notes",
      icon: <ImportIcon />,
      onPress: async () => {
        await importNotes(), onClose();
      },
    },
  ];
  const h = 80 * OptionsItems.length + 16;
  const valueY = useSharedValue(0);
  useEffect(() => {
    if (open) {
      valueY.value = withTiming(0, {
        duration: 150,
      });
    } else {
      valueY.value = withTiming(h, { duration: 100 });
    }
  }, [open]);
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      valueY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY >= h / 3) {
        runOnJS(onClose)();
      } else {
        valueY.value = withTiming(0);
      }
    });

  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <Modal animationType="none" transparent onRequestClose={onClose}>
          <MotiView
            style={{
              position: "absolute",
              width: "100%",
              height: height + top,
              top: 0,
              backgroundColor: "#000",
              zIndex: -1,
            }}
            from={{ opacity: 0 }}
            transition={
              {
                type: "timing",
                duration: 150,
              } as any
            }
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />

          <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={gesture}>
              <Animated.View
                style={{
                  transform: [{ translateY: valueY }],
                  height: height + h + top,
                  width: "100%",
                  position: "absolute",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  bottom: 0,
                }}
              >
                <Pressable
                  style={{
                    height: height + top,
                    width: "100%",
                    zIndex: -1,
                    position: "absolute",
                  }}
                  onPress={onClose}
                />
                <View
                  style={{
                    width: "100%",
                    height: h,

                    borderTopLeftRadius: 26,
                    borderTopRightRadius: 26,
                    backgroundColor: theme.background,
                    justifyContent: "center",
                    gap: 4 * OptionsItems.length,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: verticalScale(3),
                      backgroundColor: theme.onBackgroundSearch,
                      position: "absolute",
                      borderRadius: 100,
                      alignSelf: "center",
                      top: verticalScale(10),
                    }}
                  />

                  {OptionsItems.map((item, i) => {
                    return (
                      <OptionItem
                        key={i}
                        onPress={item.onPress}
                        icon={item.icon}
                        label={item.label}
                      />
                    );
                  })}
                </View>
              </Animated.View>
            </GestureDetector>
          </GestureHandlerRootView>
        </Modal>
      )}
    </AnimatePresence>
  );
}
