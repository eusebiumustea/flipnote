import { BlurView } from "expo-blur";
import {
  Animated,
  GestureResponderEvent,
  Platform,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  ClipboardIcon,
  HeartIcon,
  InfoIcon,
  ReminderIcon,
  ShareIcon,
} from "../../components/assets";

import { useCardAnimation } from "@react-navigation/stack";
import { memo } from "react";
import { useTheme } from "../../hooks";
import { contentLengthLimit } from "../../constants";

interface NoteScreenHeaderProps {
  onClipboardCopy: (e: GestureResponderEvent) => void;
  onBack: () => void;
  onFavoriteAdd?: () => void;
  onShare: () => void;
  onReminderOpen?: () => void;
  favorite?: boolean;
  emptyNote: boolean;
  iconsThemeColor: string;
  onShowNoteInfo: (e: GestureResponderEvent) => void;
  textLength?: number;
}
export const NoteScreenHeader = memo(
  ({
    onClipboardCopy,
    onBack,
    onFavoriteAdd,
    onShare,
    favorite,
    onReminderOpen,
    emptyNote,
    iconsThemeColor,
    onShowNoteInfo,
    textLength,
  }: NoteScreenHeaderProps) => {
    const { top } = useSafeAreaInsets();

    const { width } = useWindowDimensions();
    const { current } = useCardAnimation();
    const theme = useTheme();
    return (
      <Animated.View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          opacity: current.progress,
        }}
      >
        {Platform.OS === "android" && (
          <View
            style={{
              width: width,
              height: "100%",
              position: "absolute",

              backgroundColor: theme.primary,
              opacity: 0.7,
            }}
          />
        )}

        {Platform.OS === "ios" && (
          <BlurView
            tint={"systemUltraThinMaterial"}
            style={{
              width,
              height: "100%",
              position: "absolute",
            }}
          />
        )}

        <View
          style={{
            width: "100%",
            paddingTop: 8 + top,
            paddingBottom: 6,
            paddingHorizontal: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BackIcon
            color={Platform.OS === "ios" && iconsThemeColor}
            onPress={onBack}
          />

          {!emptyNote && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                zIndex: 1,
              }}
            >
              <InfoIcon
                onPress={onShowNoteInfo}
                color={
                  textLength >= contentLengthLimit()
                    ? "orange"
                    : Platform.OS === "ios" && iconsThemeColor
                }
              />

              <ReminderIcon
                color={Platform.OS === "ios" && iconsThemeColor}
                onPress={onReminderOpen}
              />

              <ClipboardIcon
                color={Platform.OS === "ios" && iconsThemeColor}
                onPress={onClipboardCopy}
              />

              <HeartIcon
                color={Platform.OS === "ios" && iconsThemeColor}
                onPress={onFavoriteAdd}
                focused={favorite}
              />

              <ShareIcon
                color={Platform.OS === "ios" && iconsThemeColor}
                onPress={onShare}
              />
            </View>
          )}
        </View>
      </Animated.View>
    );
  }
);
