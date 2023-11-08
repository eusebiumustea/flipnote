import { BlurView } from "expo-blur";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  ClipboardIcon,
  HeartIcon,
  ShareIcon,
} from "../../components/assets";

interface NoteScreenHeaderProps {
  onBack?: any;
  onCopy?: () => void;
  onFavoriteAdd?: () => void;
  onShare?: () => void;
  favorite?: boolean;
}
export function NoteScreenHeader({
  onBack,
  onCopy,
  onFavoriteAdd,
  onShare,
  favorite,
}: NoteScreenHeaderProps) {
  const { top } = useSafeAreaInsets();
  return (
    <BlurView
      intensity={20}
      style={{
        width: "100%",
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        paddingTop: top + 16,
        zIndex: 1,
        alignItems: "center",
      }}
    >
      <BackIcon onPress={onBack} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 26,
        }}
      >
        <ClipboardIcon />
        <HeartIcon onPress={onFavoriteAdd} focused={favorite} />
        <ShareIcon />
      </View>
    </BlurView>
  );
}
