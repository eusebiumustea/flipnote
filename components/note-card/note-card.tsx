import { MotiPressable } from "moti/interactions";
import { Dimensions, Text } from "react-native";
import { note } from "../../screens/note";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { CheckIcon } from "../assets/icon-buttons/check-icon";
interface NoteCardProps {
  item: note;
  onLayout?: () => void;
  onPress: () => void;
  onLongPress: () => void;
  selectedForOptions: boolean;
  options: boolean;
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
      onPress={onPress}
      style={{
        backgroundColor: item.background,
        borderRadius: 16,
        height: verticalScale(250),
        width: width / 2 - 16,
        padding: 16,
        overflow: "hidden",
        elevation: 5,
      }}
      from={{ scale: 1 }}
      animate={{ scale: selectedForOptions === true ? 0.9 : 1 }}
    >
      {options && (
        <CheckIcon
          style={{ position: "absolute", top: 0 }}
          focused={selectedForOptions}
          onPress={onPress}
        />
      )}
      {item.title && (
        <Text
          style={{
            color: "#000",
            fontSize: moderateFontScale(20),
            fontWeight: "bold",
            fontFamily: "google-sans",
          }}
        >
          {item.title}
        </Text>
      )}
      <Text
        style={{
          color: "#000",
          fontFamily: "google-sans",
          fontSize: moderateFontScale(14),
          paddingBottom: item.title ? verticalScale(40) : 0,
        }}
      >
        {item.text}
      </Text>
    </MotiPressable>
  );
}
