import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useCardAnimation } from "@react-navigation/stack";
import { MotiView } from "moti";
import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Animated, Platform } from "react-native";
import {
  FONT_SIZE,
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import {
  SharedValue,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
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
import { editorActions } from "../../../constants/customize-bar";
import { useTheme } from "../../../hooks";
import { moderateScale, toggleState } from "../../../utils";
import { Note, OptionProps } from "../types";
import { OptionContainer } from "./option-container";
import { BackgroundOptions, ColorOptions, FontSizeOptions } from "./options";
interface CustomizeBarProps {
  editNote: Note;
  setEditNote: Dispatch<SetStateAction<Note>>;
  defaultTextColor: string;
  bottomSpace: SharedValue<number>;
}
export const CustomizeBar = memo(
  forwardRef(
    (
      {
        editNote,
        setEditNote,
        defaultTextColor,
        bottomSpace,
      }: CustomizeBarProps,
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
      const optionSizeAdjust = useMemo(() => {
        switch (showOption) {
          case null:
            return 0;
          case "background":
            return isImgBg ? 100 : 60;
          case "font-color":
            return 160;
          case "font-size":
            return 70;

          default:
            return 60;
        }
      }, [showOption, isImgBg]);
      useEffect(() => {
        bottomSpace.value = withTiming(optionSizeAdjust, { duration: 180 });
      }, [showOption]);
      return (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            opacity: closing && current.progress,
            padding: 6,
          }}
        >
          <MotiView
            style={[
              {
                width: "100%",
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
              opacity: { delay: 300 },
            }}
            from={{
              paddingTop: 0,
              opacity: 0,
            }}
            animate={{
              paddingTop: optionSizeAdjust,
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
              unselectedButtonStyle={{
                pointerEvents: "box-none",
              }}
              flatContainerStyle={{ borderRadius: 16 }}
              selectedIconTint={theme.primary}
              style={{
                borderRadius: 16,
                backgroundColor: theme.customizeBarColor,
                paddingHorizontal: 12,
                width: "100%",
                alignItems: "flex-start",
              }}
              actions={editorActions}
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
                    onPress={() =>
                      setShowOption(toggleState(null, "font-color"))
                    }
                  />
                ),
                ["changeFontSize"]: ({ selected }) => (
                  <FormatSizeIcon
                    onPress={() =>
                      setShowOption(toggleState(null, "font-size"))
                    }
                    active={selected}
                  />
                ),
                ["setBg"]: () => (
                  <BackgroundIcon
                    onPress={() =>
                      setShowOption(toggleState(null, "background"))
                    }
                  />
                ),
                [actions.checkboxList]: () => (
                  <FontAwesome6
                    size={moderateScale(22)}
                    color={theme.textUnselected}
                    name="list-check"
                  />
                ),
                [actions.insertOrderedList]: () => (
                  <FontAwesome5
                    color={theme.textUnselected}
                    name="list-ol"
                    size={moderateScale(22)}
                  />
                ),
                [actions.insertBulletsList]: () => (
                  <FontAwesome5
                    color={theme.textUnselected}
                    name="list-ul"
                    size={moderateScale(22)}
                  />
                ),
                [actions.removeFormat]: () => (
                  <FontAwesome5
                    color={theme.textUnselected}
                    name="eraser"
                    size={moderateScale(22)}
                  />
                ),
                [actions.setSubscript]: ({ selected }) => (
                  <MaterialCommunityIcons
                    color={selected ? theme.primary : theme.textUnselected}
                    size={moderateScale(24)}
                    name="format-subscript"
                  />
                ),
                [actions.setSuperscript]: ({ selected }) => (
                  <MaterialCommunityIcons
                    color={selected ? theme.primary : theme.textUnselected}
                    size={moderateScale(24)}
                    name="format-superscript"
                  />
                ),
                [actions.outdent]: () => (
                  <MaterialIcons
                    size={moderateScale(24)}
                    color={theme.textUnselected}
                    name="format-indent-decrease"
                  />
                ),
                [actions.indent]: () => (
                  <MaterialIcons
                    size={moderateScale(24)}
                    color={theme.textUnselected}
                    name="format-indent-increase"
                  />
                ),
                [actions.keyboard]: () => (
                  <MaterialIcons
                    size={moderateScale(24)}
                    color={theme.textUnselected}
                    name="keyboard"
                  />
                ),
              }}
              editor={editorRef}
            />
          </MotiView>
        </Animated.View>
      );
    }
  )
);
