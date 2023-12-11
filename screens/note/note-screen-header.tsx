import { BlurView } from "expo-blur";
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  ClipboardIcon,
  HeartIcon,
  ReminderIcon,
  ShareIcon,
} from "../../components/assets";
import { useTheme } from "../../tools";

interface NoteScreenHeaderProps {
  onClipboard: () => void;
  onBack: () => void;
  onFavoriteAdd?: () => void;
  onShare: () => void;
  onReminderOpen?: () => void;
  favorite?: boolean;
}
export function NoteScreenHeader({
  onClipboard,
  onBack,
  onFavoriteAdd,
  onShare,
  favorite,
  onReminderOpen,
}: NoteScreenHeaderProps) {
  const { top } = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const theme = useTheme();
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        width: "100%",
        position: "absolute",
        paddingTop: 12,
        zIndex: 1,
        top: 0,
      }}
    >
      {Platform.OS === "android" && (
        <View
          style={{
            width: width,
            height: "100%",
            position: "absolute",
            padding: 16,
            paddingTop: 16,
            zIndex: -1,
            backgroundColor: theme.primary,
            opacity: 0.6,
            paddingBottom: 32,
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
            padding: 16,
            paddingTop: 16,
            zIndex: -1,
            paddingBottom: 32,
          }}
        />
      )}
      <View
        style={{
          width: "100%",
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 32,
        }}
      >
        <BackIcon onPress={onBack} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 16,
            zIndex: 1,
          }}
        >
          <ReminderIcon onPress={onReminderOpen} />
          <ClipboardIcon onPress={onClipboard} />
          <HeartIcon onPress={onFavoriteAdd} focused={favorite} />
          <ShareIcon onPress={onShare} />
        </View>
      </View>
    </View>
  );
}
