import { BlurView } from "expo-blur";
import { Dimensions, Platform, View, useColorScheme } from "react-native";
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
import { useTheme } from "../../hooks";
import { MotiView } from "moti";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";

interface NoteScreenHeaderProps {
  onClipboard: () => void;
  onBack: () => void;
  onFavoriteAdd?: () => void;
  onShare: () => void;
  onReminderOpen?: () => void;
  favorite?: boolean;
  onHistoryOpen?: () => void;
  historyShown: boolean;
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 14,
              zIndex: 1,
            }}
          >
            {historyShown && <ChangesIcon onPress={onHistoryOpen} />}
            <ReminderIcon onPress={onReminderOpen} />
            <ClipboardIcon onPress={onClipboard} />
            <HeartIcon onPress={onFavoriteAdd} focused={favorite} />
            <ShareIcon onPress={onShare} />
          </View>
        </View>
      </View>
    );
  }
);
