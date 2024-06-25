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
import { AnimatePresence, MotiView } from "moti";
import { Easing } from "react-native-reanimated";

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
  background: string;
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
    background,
  }: NoteScreenHeaderProps) => {
    const { top } = useSafeAreaInsets();

    const { width } = useWindowDimensions();
    const { current, closing } = useCardAnimation();
    const theme = useTheme();
    return (
      <Animated.View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          opacity: closing && current.progress,
        }}
      >
        {Platform.select({
          android: (
            <MotiView
              transition={{ duration: 300, type: "timing" }}
              animate={{
                backgroundColor: background.includes("/")
                  ? theme.onPrimary
                  : background,
              }}
              style={{
                width,
                height: "100%",
                position: "absolute",
                opacity: background.includes("/") ? 0.3 : 1,
              }}
            />
          ),
          ios: (
            <BlurView
              tint={"systemUltraThinMaterial"}
              style={{
                width,
                height: "100%",
                position: "absolute",
              }}
            />
          ),
        })}

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
          <BackIcon color={iconsThemeColor} onPress={onBack} />
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
                    : iconsThemeColor
                }
              />

              <ReminderIcon color={iconsThemeColor} onPress={onReminderOpen} />

              <ClipboardIcon
                color={iconsThemeColor}
                onPress={onClipboardCopy}
              />

              <HeartIcon
                color={iconsThemeColor}
                onPress={onFavoriteAdd}
                focused={favorite}
              />

              <ShareIcon color={iconsThemeColor} onPress={onShare} />
            </View>
          )}
        </View>
      </Animated.View>
    );
  }
);
