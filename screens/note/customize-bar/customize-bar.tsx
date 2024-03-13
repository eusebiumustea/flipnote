import { useKeyboard } from "@react-native-community/hooks";
import { AnimatePresence, MotiView } from "moti";
import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ColorValue,
  Dimensions,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import {
  BackgroundIcon,
  BoldIcon,
  CenterAlignIcon,
  ChevronDownIcon,
  FontColorIcon,
  FormatSizeIcon,
  ItalicIcon,
  JustifyAlignIcon,
  LeftAlignIcon,
  RedoIcon,
  RightAlignIcon,
  TextIcon,
  UnderlineIcon,
  UndoIcon,
} from "../../../components/assets";
import { moderateScale, toggleState, verticalScale } from "../../../tools";
import { InputSelectionProps, note } from "../types";
import { OptionContainer } from "./option-container";
import { useTheme } from "../../../hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCardAnimation } from "@react-navigation/stack";
import { useNoteUtils } from "../../../hooks/use-note-utills";
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
  onUndo?: () => void;
  onRedo?: () => void;
  setEditNote?: Dispatch<SetStateAction<note>>;
  contentPosition?: "center" | "left" | "right" | "justify";
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

  setEditNote,
  contentPosition,
}: CustomizeBarProps) {
  const [showOption, setShowOption] = useState<string | null>(null);
  const theme = useTheme();
  const keyboard = useKeyboard();
  const keyboardHeight =
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
  useEffect(() => {
    if (selection.end === selection.start && showOption) {
      setShowOption(null);
    }
  }, [selection]);
  const { width, height } = useWindowDimensions();
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
        marginBottom: keyboardHeight + 12,
        width: width - 16,
      }}
      from={{
        paddingTop: 0,
      }}
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
        scroll={false}
        children={fontColorOptions}
        show={showOption === "font-color"}
      />

      <OptionContainer
        scroll={false}
        children={fontSizeOptions}
        show={showOption === "font-size"}
      />

      <ScrollView
        decelerationRate={"fast"}
        contentContainerStyle={{
          padding: 12,
          flexDirection: "row",
          columnGap: 12,
          alignItems: "center",
        }}
        horizontal
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        style={{
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
        <LeftAlignIcon
          active={contentPosition === "left"}
          onPress={() =>
            setEditNote((prev) => ({ ...prev, contentPosition: "left" }))
          }
        />
        <CenterAlignIcon
          active={contentPosition === "center"}
          onPress={() =>
            setEditNote((prev) => ({ ...prev, contentPosition: "center" }))
          }
        />
        <RightAlignIcon
          active={contentPosition === "right"}
          onPress={() =>
            setEditNote((prev) => ({ ...prev, contentPosition: "right" }))
          }
        />
        {/* <UndoIcon onPress={onUndo} />
        <RedoIcon onPress={onRedo} /> */}
      </ScrollView>
    </MotiView>
  );
}
