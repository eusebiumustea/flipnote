import { BlurView } from "expo-blur";
import { AnimatePresence, MotiView } from "moti";
import { Fragment } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon, ScreenHeader, Swipe } from "../../../components";
import { moderateFontScale, moderateScale, useTheme } from "../../../tools";
import { HistoryChangesProps } from "./types";

export function HistoryChanges({
  opened,
  onClose,
  text,
  styles,
  setEditNote,
  background,
}: HistoryChangesProps) {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const gestureConfig =
    Platform.OS === "ios" &&
    Swipe({
      onRelease: (e, state) => {
        const x = state.dx;
        const pageX = e.nativeEvent.pageX;
        if (x > 0 && pageX < 200) {
          onClose();
        }
      },
    });
  const theme = useTheme();
  return (
    <AnimatePresence>
      {opened && (
        <Modal animationType="none" onRequestClose={onClose} transparent>
          <MotiView
            transition={{
              type: "timing",
              duration: 200,
            }}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              zIndex: -2,
              position: "absolute",
            }}
          >
            <BlurView tint="dark" style={{ flex: 1 }} />
          </MotiView>
          <MotiView
            {...gestureConfig}
            transition={{
              type: "timing",
              duration: 300,
              easing: Easing.inOut(Easing.linear),
            }}
            style={{
              backgroundColor: theme.background,
              flex: 1,
            }}
            from={{
              translateX: 0,
              translateY: -height / 2 + top,
              scale: 0,
            }}
            animate={{ translateX: 0, translateY: 0, scale: 1 }}
            exit={{
              translateX: 0,
              translateY: -height / 2 + top,
              scale: 0,
            }}
          >
            <ScreenHeader
              style={{ paddingVertical: 10 }}
              children={
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: theme.onPrimary,
                      fontWeight: "bold",
                      fontSize: moderateFontScale(20),
                    }}
                  >
                    Changes
                  </Text>
                </View>
              }
              onBack={onClose}
            />
            <FlatList
              contentContainerStyle={{
                gap: 12,
                padding: 12,
                paddingBottom: 30,
              }}
              style={{
                flex: 1,
              }}
              data={styles}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Fragment>
                  <View
                    onStartShouldSetResponder={() => false}
                    style={{
                      width: "100%",
                      padding: 16,
                      backgroundColor: theme.onPrimary,
                      borderRadius: 16,
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: moderateScale(20),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          padding: 5,
                          backgroundColor: "#fff",
                          borderRadius: 8,
                          maxWidth: width / 3,
                        }}
                      >
                        <Text>
                          {text.slice(item.interval.start, item.interval.end)}
                        </Text>
                      </View>
                      <BackIcon
                        color={theme.primary}
                        style={{
                          transform: [{ rotate: "180deg" }, { scaleY: 0.7 }],
                        }}
                      />
                      <View
                        style={{
                          padding: 5,
                          backgroundColor: background,
                          borderRadius: 8,
                          maxWidth: width / 3,
                        }}
                      >
                        <Text style={item.style}>
                          {text.slice(item.interval.start, item.interval.end)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setEditNote((prev) => ({
                        ...prev,
                        styles: prev.styles.filter((e) => e !== item),
                      }))
                    }
                    style={{
                      backgroundColor: theme.onBackground,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      alignSelf: "center",
                      marginTop: 12,
                    }}
                  >
                    <Text style={{ color: "orangered" }}>Undo</Text>
                  </TouchableOpacity>
                </Fragment>
              )}
            />
          </MotiView>
        </Modal>
      )}
    </AnimatePresence>
  );
}
