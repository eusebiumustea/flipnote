import { AnimatePresence, MotiView } from "moti";
import { memo, useEffect } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateFontScale, verticalScale } from "../../../tools";
import { HistoryChangesProps } from "./types";
import { useTheme } from "../../../hooks";
import { BlurView } from "expo-blur";
import { Swipe } from "../../../components/pan-responder";
import { ScreenHeader } from "../../../components/screen-header";
import { BackIcon } from "../../../components/assets";

export const HistoryChanges = memo(
  ({
    opened,
    onClose,
    text,
    styles,
    setEditNote,
    background,
  }: HistoryChangesProps) => {
    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();
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
    useEffect(() => {
      if (styles.length === 0) {
        onClose();
      }
    }, [styles]);

    return (
      <AnimatePresence>
        {opened && (
          <Modal
            visible={opened}
            animationType="none"
            onRequestClose={onClose}
            transparent
          >
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
                duration: 200,
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
                      Text design changes
                    </Text>
                  </View>
                }
                onBack={onClose}
              />

              <FlatList
                removeClippedSubviews
                contentContainerStyle={{
                  gap: 12,
                  padding: 12,
                  paddingBottom: bottom,
                }}
                style={{ flex: 1, height }}
                data={styles}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <>
                    <Pressable
                      style={{
                        width: "100%",
                        backgroundColor: theme.onPrimary,
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.primary,

                          borderRadius: 8,
                          padding: 6,
                        }}
                      >
                        {text.slice(item.interval.start, item.interval.end)}
                      </Text>

                      <BackIcon
                        btnProps={{ activeOpacity: 1 }}
                        color={theme.primary}
                        style={{
                          transform: [{ rotate: "270deg" }, { scaleY: 0.7 }],
                          paddingBottom: 6,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: background,
                          padding: 6,

                          borderRadius: 16,
                          margin: 6,
                        }}
                      >
                        <Text style={item.style}>
                          {text.slice(item.interval.start, item.interval.end)}
                        </Text>
                      </View>
                    </Pressable>
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
                      <Text style={{ color: "orangered" }}>Remove</Text>
                    </TouchableOpacity>
                  </>
                )}
              />
            </MotiView>
          </Modal>
        )}
      </AnimatePresence>
    );
  }
);
