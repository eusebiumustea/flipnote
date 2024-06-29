import { useCardAnimation } from "@react-navigation/stack";
import { MotiView } from "moti";
import React, { Dispatch, SetStateAction, forwardRef, useState } from "react";
import { Animated, Platform } from "react-native";
import {
  FONT_SIZE,
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackgroundIcon,
  BoldIcon,
  CenterAlignIcon,
  FontColorIcon,
  FormatSizeIcon,
  ItalicIcon,
  LeftAlignIcon,
  RedoIcon,
  RightAlignIcon,
  UnderlineIcon,
  UndoIcon,
} from "../../../components";
import { cardColors } from "../../../constants";
import { useTheme } from "../../../hooks";
import { toggleState } from "../../../utils";
import { Note, OptionProps } from "../types";
import { OptionContainer } from "./option-container";
import { BackgroundOptions, ColorOptions, FontSizeOptions } from "./options";
interface CustomizeBarProps {
  editNote: Note;
  setEditNote: Dispatch<SetStateAction<Note>>;
  defaultTextColor: string;
}
export const CustomizeBar = forwardRef(
  (
    { editNote, setEditNote, defaultTextColor }: CustomizeBarProps,
    editorRef: React.MutableRefObject<RichEditor>
  ) => {
    const { bottom } = useSafeAreaInsets();
    const keyboard = Platform.OS === "ios" && useAnimatedKeyboard();
    const animatedStyles =
      Platform.OS === "ios" &&
      useAnimatedStyle(() => ({
        transform: [{ translateY: -keyboard.height.value || -bottom }],
      }));

    const theme = useTheme();
    const optionProps: OptionProps = {
      editNote,
      setEditNote,
      colors: cardColors,
      defaultTextColor,
      onColorChange: (value) => editorRef.current?.setForeColor(value),
    };

    const isImgBg = editNote.background.includes("/");
    const { closing, current } = useCardAnimation();
    const [showOption, setShowOption] = useState<string | null>(null);
    function optionSizeAdjust() {
      switch (showOption) {
        case "background":
          return isImgBg ? 100 : 60;
        case "font-color":
          return 160;
        case "font-size":
          return 70;
        default:
          return 60;
      }
    }

    return (
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          opacity: closing && current.progress,
        }}
      >
        <MotiView
          style={[
            {
              width: "96%",
              alignItems: "center",
              borderRadius: 16,
              alignSelf: "center",
              backgroundColor: theme.customizeBarColor,
            },
            animatedStyles,
          ]}
          transition={{
            type: "timing",
            duration: 180,
          }}
          from={{
            paddingTop: 0,
            opacity: 0,
          }}
          animate={{
            paddingTop: showOption ? optionSizeAdjust() : 0,
            opacity: 1,
          }}
        >
          <OptionContainer
            children={
              <FontSizeOptions
                onReset={() => editorRef.current.setFontSize(3)}
                onValueChange={(value) =>
                  editorRef.current.setFontSize(value as FONT_SIZE)
                }
              />
            }
            show={showOption === "font-size"}
          />
          <OptionContainer
            children={<BackgroundOptions {...optionProps} />}
            show={showOption === "background"}
          />
          <OptionContainer
            children={<ColorOptions {...optionProps} />}
            show={showOption === "font-color"}
          />
          <RichToolbar
            selectedIconTint={theme.primary}
            style={{
              borderRadius: 16,
              backgroundColor: theme.customizeBarColor,
              paddingHorizontal: 12,
              width: "100%",
              alignItems: "flex-start",
            }}
            actions={[
              actions.keyboard,
              actions.undo,
              actions.redo,
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              "textColor",
              "changeFontSize",
              "setBg",
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.checkboxList,
              actions.insertOrderedList,
              actions.insertBulletsList,
              actions.removeFormat,
              actions.setSubscript,
              actions.setSuperscript,
              actions.outdent,
              actions.indent,
            ]}
            iconMap={{
              [actions.undo]: () => <UndoIcon />,
              [actions.redo]: () => <RedoIcon />,
              [actions.setBold]: ({ selected }) => (
                <BoldIcon active={selected} />
              ),
              [actions.setItalic]: ({ selected }) => (
                <ItalicIcon active={selected} />
              ),
              [actions.setUnderline]: ({ selected }) => (
                <UnderlineIcon active={selected} />
              ),
              [actions.alignLeft]: ({ selected }) => (
                <LeftAlignIcon active={selected} />
              ),
              [actions.alignCenter]: ({ selected }) => (
                <CenterAlignIcon active={selected} />
              ),
              [actions.alignRight]: ({ selected }) => (
                <RightAlignIcon active={selected} />
              ),
              ["textColor"]: () => (
                <FontColorIcon
                  onPress={() => setShowOption(toggleState(null, "font-color"))}
                />
              ),
              ["changeFontSize"]: ({ selected }) => (
                <FormatSizeIcon
                  onPress={() => setShowOption(toggleState(null, "font-size"))}
                  active={selected}
                />
              ),
              ["setBg"]: () => (
                <BackgroundIcon
                  onPress={() => setShowOption(toggleState(null, "background"))}
                />
              ),
            }}
            editor={editorRef}
          />
        </MotiView>
      </Animated.View>
    );
  }
);
