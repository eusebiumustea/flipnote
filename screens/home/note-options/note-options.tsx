import { TouchableOpacity, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CloseIcon, HeartIcon, DeleteIcon } from "../../../components/assets";
import { moderateScale, useTheme, verticalScale } from "../../../tools";
import { MotiView } from "moti";
import { CheckIcon } from "../../../components/assets/check-icon";
interface NoteOptionsProps {
  onDelete: () => void;
  onClose: () => void;
  onTotalSelect: () => void;
  totalSelected: boolean;
}
export function NoteOptions({
  onDelete,
  onClose,
  onTotalSelect,
  totalSelected,
}: NoteOptionsProps) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "space-between",
        position: "absolute",
        backgroundColor: theme.background,
        zIndex: 6,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: moderateScale(20),
        padding: 10,
        top,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
      >
        <CloseIcon onPress={onClose} />
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={onTotalSelect}
        >
          <CheckIcon fill={theme.onPrimary} focused={totalSelected} />
          <Text style={{ color: theme.onPrimary, fontFamily: "google-sans" }}>
            Select all
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 20 }}
      >
        <DeleteIcon onPress={onDelete} />
      </View>
    </View>
  );
}
