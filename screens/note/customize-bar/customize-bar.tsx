import { useKeyboard } from "@react-native-community/hooks";
import { MotiView } from "moti";
import { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import {
  ColorValue,
  Dimensions,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  BackgroundIcon,
  BoldIcon,
  FontColorIcon,
  FormatSizeIcon,
  ItalicIcon,
  TextIcon,
  UnderlineIcon,
} from "../../../components/assets";
import { toggleState } from "../../../tools";
import { InputSelectionProps } from "../types";
import { OptionContainer } from "./option-container";
import { useTheme } from "../../../hooks";
interface CustomizeBarProps {
  boldFocused?: boolean;
  italicFocused?: boolean;
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  underLinedFocused?: boolean;
  backgroundOptions?: PropsWithChildren<ReactNode>;
  fontOptions?: PropsWithChildren<ReactNode>;
  fontColorOptions?: PropsWithChildren<ReactNode>;
  onFontColor?: () => void;
  fontSizeOptions?: PropsWithChildren<ReactNode>;
  selection?: InputSelectionProps;
  focusedColor?: ColorValue | string;
}
export function CustomizeBar({
  backgroundOptions,
  onBold,
  onItalic,
  italicFocused,
  boldFocused,
  underLinedFocused,
  fontOptions,
  onUnderline,
  fontColorOptions,
  onFontColor,
  selection,
  focusedColor,
  fontSizeOptions,
}: CustomizeBarProps) {
  const [showOption, setShowOption] = useState<string | null>(null);
  const theme = useTheme();
  const keyboard = useKeyboard();
  const { width } = useWindowDimensions();
  const paddingTop =
    Platform.OS === "android"
      ? Dimensions.get("screen").height -
        (keyboard.coordinates.start?.screenY || Dimensions.get("screen").height)
      : Dimensions.get("screen").height -
        (keyboard.coordinates.end?.screenY || Dimensions.get("screen").height);
  function optionSizeAdjust() {
    switch (showOption) {
      case "font-color":
        return 160;
      case "font-size":
        return 100;
      default:
        return 60;
    }
  }
  useMemo(() => {
    if (selection.end === selection.start && showOption) {
      setShowOption(null);
    }
  }, [selection]);
  return (
    <MotiView
      transition={{
        type: "timing",
        duration: 300,
      }}
      style={{
        borderRadius: 16,
        backgroundColor: theme.customizeBarColor,
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        marginBottom: paddingTop + 20,
        width: width - 30,
      }}
      from={{ paddingTop: 0 }}
      animate={{
        paddingTop: showOption ? optionSizeAdjust() : 0,
      }}
    >
      <OptionContainer
        children={backgroundOptions}
        show={showOption === "background"}
      />

      <OptionContainer children={fontOptions} show={showOption === "font"} />

      <OptionContainer
        children={fontColorOptions}
        show={showOption === "font-color"}
      />

      <OptionContainer
        children={fontSizeOptions}
        show={showOption === "font-size"}
      />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        decelerationRate={"fast"}
        contentContainerStyle={{
          padding: 15,

          flexDirection: "row",
          columnGap: 15,
          alignSelf: "flex-start",
          width: "100%",
          alignItems: "center",
        }}
        horizontal
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        style={{
          backgroundColor: theme.customizeBarColor,
          alignSelf: "center",
          borderRadius: 16,
        }}
      >
        <BoldIcon active={boldFocused} onPress={onBold} />
        <ItalicIcon active={italicFocused} onPress={onItalic} />
        <UnderlineIcon active={underLinedFocused} onPress={onUnderline} />
        <TextIcon
          onPress={() => {
            if (selection.end !== selection.start) {
              setShowOption(toggleState(null, "font"));
            }
          }}
        />
        <FontColorIcon
          color={focusedColor}
          onPress={() => {
            if (selection.end !== selection.start) {
              setShowOption(toggleState(null, "font-color", onFontColor));
            }
          }}
        />

        <FormatSizeIcon
          onPress={() => {
            if (selection.end !== selection.start) {
              setShowOption(toggleState(null, "font-size"));
            }
          }}
        />
        <BackgroundIcon
          onPress={() => setShowOption(toggleState(null, "background"))}
        />
      </ScrollView>
    </MotiView>
  );
}
