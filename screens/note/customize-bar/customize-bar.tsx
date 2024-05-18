import { useKeyboard } from "@react-native-community/hooks";
import { MotiView } from "moti";
import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Animated,
  ColorValue,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackgroundIcon,
  BoldIcon,
  CenterAlignIcon,
  ChevronDownIcon,
  FontColorIcon,
  FormatSizeIcon,
  ItalicIcon,
  LeftAlignIcon,
  RightAlignIcon,
  TextIcon,
  UnderlineIcon,
  UndoIcon,
} from "../../../components/assets";
import { useTheme } from "../../../hooks";
import {
  moderateScale,
  removeElementAtIndex,
  toggleState,
  verticalScale,
} from "../../../utils";
import { InputSelectionProps, note } from "../types";
import { OptionContainer } from "./option-container";
import { useToast } from "../../../components";
import { useCardAnimation } from "@react-navigation/stack";
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
  contentPosition?: "center" | "left" | "right";
  isImgBg: boolean;
  currentIndex: number;
}
export function CustomizeBar({
  currentIndex,
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
  isImgBg,
  setEditNote,
  contentPosition,
}: CustomizeBarProps) {
  const [showOption, setShowOption] = useState<string | null>(null);
  const theme = useTheme();
  const keyboard = useKeyboard();
  const keyboardHeight =
    Platform.OS === "ios" &&
    Dimensions.get("screen").height -
      (keyboard.coordinates.end?.screenY || Dimensions.get("screen").height);
  function optionSizeAdjust() {
    switch (showOption) {
      case "background":
        return isImgBg ? 100 : 60;
      case "font-color":
        return 160;
      case "font-size":
        return 100;
      default:
        return 60;
    }
  }
  const { bottom } = useSafeAreaInsets();
  useEffect(() => {
    if (selection.end === selection.start && showOption) {
      setShowOption(null);
    }
  }, [selection]);
  const { width } = useWindowDimensions();

  const toast = useToast();
  const { current } = useCardAnimation();
  return (
    <Animated.View
      style={{
        opacity: current.progress,

        position: "absolute",

        alignSelf: "center",
        width: width - 16,
        bottom: 0,
      }}
    >
      <MotiView
        transition={
          {
            type: "timing",
            duration: 200,
            marginBottom: {
              duration: 160,
              easing: Easing.inOut(Easing.linear),
            },
          } as any
        }
        style={{
          borderRadius: 16,
          backgroundColor: theme.customizeBarColor,
        }}
        from={{
          paddingTop: 0,
        }}
        animate={{
          paddingTop: showOption ? optionSizeAdjust() : 0,
          marginBottom: keyboardHeight || bottom,
        }}
      >
        <OptionContainer
          children={backgroundOptions}
          show={showOption === "background"}
          scroll={false}
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
            columnGap: 10,
            alignItems: "center",
          }}
          horizontal
          keyboardShouldPersistTaps="always"
          style={{
            alignSelf: "center",
            borderRadius: 16,
          }}
        >
          {keyboardHeight > 0 && Platform.OS === "ios" && (
            <ChevronDownIcon
              onPress={() => {
                Keyboard.dismiss();
              }}
              svgProps={{ fill: theme.primary }}
              style={{
                position: "absolute",
                width: moderateScale(25),
                height: verticalScale(25),
              }}
            />
          )}
          {currentIndex > -1 && (
            <UndoIcon
              onPress={() =>
                setEditNote((prev) => ({
                  ...prev,
                  styles: removeElementAtIndex(prev.styles, currentIndex),
                }))
              }
            />
          )}

          <BoldIcon active={boldFocused} onPress={onBold} />

          <ItalicIcon active={italicFocused} onPress={onItalic} />

          <UnderlineIcon active={underLinedFocused} onPress={onUnderline} />

          <TextIcon
            onPress={() => {
              if (selection.end !== selection.start) {
                setShowOption(toggleState(null, "font"));
              } else {
                toast({
                  message: "Select text",
                  duration: 400,
                });
              }
            }}
          />

          <FontColorIcon
            color={focusedColor}
            onPress={() => {
              if (selection.end !== selection.start) {
                setShowOption(toggleState(null, "font-color", onFontColor));
              } else {
                toast({
                  message: "Select text",
                  duration: 400,
                });
              }
            }}
          />

          <FormatSizeIcon
            onPress={() => {
              if (selection.end !== selection.start) {
                setShowOption(toggleState(null, "font-size"));
              } else {
                toast({
                  message: "Select text",
                  duration: 400,
                });
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

          {/* <RedoIcon onPress={onRedo} /> */}
        </ScrollView>
      </MotiView>
    </Animated.View>
  );
}
