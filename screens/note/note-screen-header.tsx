import { BlurView } from "expo-blur";
import {
  Dimensions,
  GestureResponderEvent,
  Platform,
  View,
  useColorScheme,
} from "react-native";
import { Text } from "react-native-fast-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  ChangesIcon,
  ClipboardIcon,
  HeartIcon,
  ReminderIcon,
  ShareIcon,
} from "../../components/assets";

import { memo } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import {
  contentLengthLimit,
  moderateFontScale,
  moderateScale,
} from "../../tools";

interface NoteScreenHeaderProps {
  onClipboard: () => void;
  onBack: () => void;
  onFavoriteAdd?: () => void;
  onShare: () => void;
  onReminderOpen?: () => void;
  favorite?: boolean;
  onHistoryOpen?: (e: GestureResponderEvent) => void;
  historyShown: boolean;
  emptyNote: boolean;
  textLength: number;
}
export const NoteScreenHeader = memo(
  ({
    onClipboard,
    onBack,
    onFavoriteAdd,
    onShare,
    favorite,
    onReminderOpen,
    onHistoryOpen,
    historyShown,
    emptyNote,
    textLength,
  }: NoteScreenHeaderProps) => {
    const { top } = useSafeAreaInsets();
    const { width } = Dimensions.get("window");
    const theme = useTheme();
    const colorScheme = useColorScheme();
    return (
      <View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
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
            tint={colorScheme}
            intensity={40}
            style={{
              width: width,
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
          <BackIcon onPress={onBack} />

          {!emptyNote && (
            <Animated.View
              entering={FadeIn.duration(300).delay(100)}
              exiting={FadeOut.duration(300).delay(100)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  color: theme.onPrimary,
                  fontSize: moderateFontScale(13),
                }}
              >{`${textLength} / ${contentLengthLimit()}`}</Text>
              {/* {historyShown && <ChangesIcon onPress={onHistoryOpen} />} */}

              <ReminderIcon onPress={onReminderOpen} />

              <ClipboardIcon onPress={onClipboard} />

              <HeartIcon onPress={onFavoriteAdd} focused={favorite} />

              <ShareIcon onPress={onShare} />
            </Animated.View>
          )}
        </View>
      </View>
    );
  }
);
