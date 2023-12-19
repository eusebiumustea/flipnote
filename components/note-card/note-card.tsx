import { MotiPressable } from "moti/interactions";
import { Dimensions, Text, View } from "react-native";
import { note } from "../../screens/note";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import Checkbox from "expo-checkbox";
interface NoteCardProps {
  item: note;
  onLayout?: () => void;
  onPress: () => void;
  onLongPress: () => void;
  selectedForOptions: boolean;
  options: boolean;
  deletedProgress: boolean;
}
export function NoteCard({
  item,
  onLayout,
  onPress,
  onLongPress,
  selectedForOptions,
  options,
  deletedProgress,
}: NoteCardProps) {
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  function scale() {
    if (deletedProgress) {
      return 0;
    }
    if (selectedForOptions) {
      return 0.9;
    }
    return 1;
  }
  return (
    <MotiPressable
      transition={{
        type: "timing",
        duration: 160,
        delay: deletedProgress ? item.id * 160 : 0,
      }}
      onLongPress={onLongPress}
      onPress={onPress}
      style={{
        backgroundColor: item.background,
        borderRadius: 16,
        height: verticalScale(250),
        width: width / 2 - 16,
        padding: 16,

        elevation: 5,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
      }}
      from={{ scale: 1, opacity: 1 }}
      animate={{ scale: scale(), opacity: deletedProgress ? 0 : 1 }}
    >
      {options && (
        <Checkbox
          style={{ position: "absolute", borderRadius: 100 }}
          value={selectedForOptions}
        />
      )}
      <View style={{ flex: 1, overflow: "hidden" }}>
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
          }}
        >
          {item.text}
        </Text>
      </View>
    </MotiPressable>
  );
}
