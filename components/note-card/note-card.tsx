import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { note } from "../../screens/note";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { CheckIcon } from "../assets/check-icon";
import { MotiPressable } from "moti/interactions";
interface NoteCardProps {
  item?: note;
  onLayout?: any;
  onPress: () => void;
  onLongPress?: any;
  selectedForOptions?: boolean;
  options?: boolean;
}
export function NoteCard({
  item,
  onLayout,
  onPress,
  onLongPress,
  selectedForOptions,
  options,
}: NoteCardProps) {
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  return (
    <MotiPressable
      transition={{ type: "timing", duration: 120 }}
      onLongPress={onLongPress}
      onLayout={onLayout}
      onPress={onPress}
      from={{
        backgroundColor: item.cardColor,
        borderRadius: 16,
        height: verticalScale(250),
        width: width / 2 - 16,
        overflow: "hidden",
        padding: 16,
      }}
      animate={{ scale: options ? 0.93 : 1, translateY: 0 }}
    >
      {options && <CheckIcon focused={selectedForOptions} />}
      {item.title && (
        <Text
          style={{
            color: "#000",
            fontSize: moderateFontScale(20),
            fontWeight: "bold",
          }}
        >
          {item.title}
        </Text>
      )}
      <Text
        style={{
          color: "#000",
          fontSize: moderateFontScale(14),
          paddingBottom: item.title ? verticalScale(40) : 0,
        }}
      >
        {item.text}
      </Text>
    </MotiPressable>
  );
}
