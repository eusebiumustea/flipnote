import { BlurView } from "expo-blur";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  ClipboardIcon,
  HeartIcon,
  ShareIcon,
} from "../../components/assets";
import { moderateScale, verticalScale } from "../../tools";

interface NoteScreenHeaderProps {
  onBack?: any;
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
      intensity={30}
      style={{
        width: "100%",
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,

        paddingTop: top,
        zIndex: 6,
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
        <HeartIcon />
        <ShareIcon />
      </View>
    </BlurView>
  );
}
