import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ColorValue,
} from "react-native";
import { useTheme, verticalScale } from "../../tools";
import { cardColors } from "../../tools/colors";
interface NoteCardProps {
  text: string;
  bgColor?: ColorValue;
  onPress: () => void;
}
export function NoteCard({
  text,
  bgColor = cardColors[Math.floor(Math.random() * cardColors.length)],
  onPress,
}: NoteCardProps) {
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        backgroundColor: bgColor,
        borderRadius: 16,
        maxWidth: width / 2 - 20,
        maxHeight: verticalScale(250),
        width: "auto",
        height: "auto",
        overflow: "hidden",
      }}
    >
      <Text style={{ padding: 16, color: theme.text }}>{text}</Text>
    </TouchableOpacity>
  );
}
