import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CloseIcon, HeartIcon, DeleteIcon } from "../../../components/assets";
import { moderateScale, useTheme, verticalScale } from "../../../tools";
import { MotiView } from "moti";
interface NoteOptionsProps {
  onFavorite?: any;
  onDelete?: any;
  favoriteFocused?: boolean;
  onClose?: any;
}
export function NoteOptions({ onDelete, onClose }: NoteOptionsProps) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <MotiView
      transition={{ type: "timing", duration: 120 }}
      from={{
        width: "100%",
        justifyContent: "space-between",
        position: "absolute",
        backgroundColor: theme.background,
        zIndex: 3,
        alignItems: "center",
        flexDirection: "row",
        height: verticalScale(60),
        paddingHorizontal: moderateScale(20),

        top,
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CloseIcon onPress={onClose} />
      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 20 }}
      >
        <DeleteIcon onPress={onDelete} />
      </View>
    </MotiView>
  );
}
