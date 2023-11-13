import { BlurView } from "expo-blur";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  ClipboardIcon,
  HeartIcon,
  ShareIcon,
} from "../../components/assets";
import { useTheme } from "../../tools";

interface NoteScreenHeaderProps {
  onClipboard: () => void;
  onBack: () => void;
  onFavoriteAdd?: () => void;
  onShare?: () => void;
  favorite?: boolean;
}
export function NoteScreenHeader({
  onClipboard,
  onBack,
  onFavoriteAdd,
  onShare,
  favorite,
}: NoteScreenHeaderProps) {
  const { top } = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const theme = useTheme();
  return (
    <View
      style={{
        width: "100%",
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        paddingTop: top + 16,
        zIndex: 1,
        paddingBottom: 26,
        alignItems: "center",
        top: 0,
      }}
    >
      <View
        style={{
          width: width,
          height: "100%",
          position: "absolute",
          padding: 16,
          paddingTop: top + 16,
          zIndex: -1,
          backgroundColor: theme.primary,
          opacity: 0.6,
        }}
      />
      <BackIcon onPress={onBack} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 26,
          zIndex: 1,
        }}
      >
        <ClipboardIcon onPress={onClipboard} />
        <HeartIcon onPress={onFavoriteAdd} focused={favorite} />
        <ShareIcon onPress={onShare} />
      </View>
    </View>
  );
}
