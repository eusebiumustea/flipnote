import { memo, useEffect } from "react";
import { Platform, Text, View, useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Swipe } from "../../../components/pan-responder";
import { useTheme } from "../../../hooks";
import { moderateFontScale } from "../../../tools";
import { HistoryChangesProps } from "./types";

import { AnimatedScreen, ScreenHeader } from "../../../components";
import { StyleCard } from "./style-card";

export const StyleChanges = memo(
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
      <AnimatedScreen
        open={opened}
        onClose={onClose}
        transition={{
          type: "timing",
          duration: 200,
        }}
        containerStyle={{
          backgroundColor: theme.background,
          flex: 1,
        }}
        initial={{
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
          contentContainerStyle={{
            gap: 12,
            padding: 12,
            paddingBottom: bottom,
          }}
          style={{ flex: 1, height }}
          data={styles}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <StyleCard
              background={background}
              theme={theme}
              text={text}
              setEditNote={setEditNote}
              item={item}
            />
          )}
        />
      </AnimatedScreen>
    );
  }
);
