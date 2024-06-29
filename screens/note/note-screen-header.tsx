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
import { MotiView } from "moti";
import { memo } from "react";
import { FadeIn } from "react-native-reanimated";
import { contentLengthLimit } from "../../constants";
import { useTheme } from "../../hooks";
import { ReanimatedView } from "../../utils/reanimated-view";

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
              animate={{
                backgroundColor: background.includes("/")
                  ? theme.onPrimary
                  : background,
                opacity: background.includes("/") ? 0.5 : 1,
              }}
              style={{
                width,
                height: "100%",
                position: "absolute",
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
            <ReanimatedView
              entering={FadeIn.springify(1000)}
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
            </ReanimatedView>
          )}
        </View>
      </Animated.View>
    );
  }
);
