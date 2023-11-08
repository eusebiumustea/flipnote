import {
  Dimensions,
  GestureResponderEvent,
  ScrollView,
  View,
} from "react-native";
import { useTheme } from "../../../tools";
import {
  BoldIcon,
  CenterAlignIcon,
  ItalicIcon,
  JustifyAlignIcon,
  LeftAlignIcon,
  RightAlignIcon,
  TextIcon,
  UnderlineIcon,
} from "../../../components/assets";
import { useKeyboard } from "@react-native-community/hooks";
interface CustomizeBarProps {
  onBold: () => void;
  onItalic: () => void;
}
export function CustomizeBar() {
  const theme = useTheme();
  const keyboard = useKeyboard();

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("bold");
  };

  // const isHidden =
  //   !keyboard.coordinates.end.screenY ||
  //   keyboard.coordinates.end.screenY === Dimensions.get("screen").height;

  const paddingTop =
    Dimensions.get("screen").height -
    (keyboard.coordinates.end.screenY || Dimensions.get("screen").height);
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 15,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
      }}
      horizontal
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      style={{
        position: "absolute",
        bottom: 0,
        backgroundColor: theme.customizeBarColor,
        width: "90%",
        borderRadius: 16,
        alignSelf: "center",
        marginBottom: paddingTop + 20,
      }}
    >
      <BoldIcon active onPress={handlePress} />
      <ItalicIcon onPress={handlePress} />
      <UnderlineIcon onPress={handlePress} />
      <TextIcon onPress={handlePress} />
      <JustifyAlignIcon active onPress={handlePress} />
      <LeftAlignIcon onPress={handlePress} />
      <CenterAlignIcon onPress={handlePress} />
      <RightAlignIcon onPress={handlePress} />
    </ScrollView>
  );
}
