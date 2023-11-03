import { BlurView } from "expo-blur";
import { moderateScale, verticalScale } from "../../tools";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import {
  BackIcon,
  ClipboardIcon,
  HeartIcon,
  ShareIcon,
} from "../../components/assets";

interface NoteScreenHeaderProps {
  onBack?: () => void;
  onCopy?: () => void;
  onFavoriteAdd?: () => void;
  onShare?: () => void;
}
export function NoteScreenHeader({
  onBack,
  onCopy,
  onFavoriteAdd,
  onShare,
}: NoteScreenHeaderProps) {
  const { top } = useSafeAreaInsets();
  return (
    <BlurView
      style={{
        width: "100%",
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        zIndex: 6,
        paddingTop: top,
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
        <HeartIcon />
        <ShareIcon />
      </View>
    </BlurView>
  );
}
