import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ColorValue,
} from "react-native";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { cardColors } from "../../tools/colors";
import { note } from "../../screens/note";
interface NoteCardProps {
  item?: note;
  onLayout?: any;
  onPress: () => void;
}
export function NoteCard({ item, onLayout, onPress }: NoteCardProps) {
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  return (
    <TouchableOpacity
      onLayout={onLayout}
      onPress={onPress}
      activeOpacity={1}
      style={{
        backgroundColor: item.cardColor,
        borderRadius: 16,
        maxWidth: width / 2 - 16,
        maxHeight: verticalScale(250),
        width: "auto",
        height: "auto",
        overflow: "hidden",
        padding: 16,
      }}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: moderateFontScale(25),
          fontWeight: "bold",
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          color: theme.text,
          fontSize: moderateFontScale(18),
        }}
      >
        {item.text}
      </Text>
    </TouchableOpacity>
  );
}
