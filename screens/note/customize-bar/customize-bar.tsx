import { useKeyboard } from "@react-native-community/hooks";
import {
  ColorValue,
  Dimensions,
  GestureResponderEvent,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import {
  BackgroundIcon,
  BoldIcon,
  CenterAlignIcon,
  FontColorIcon,
  ItalicIcon,
  JustifyAlignIcon,
  LeftAlignIcon,
  RightAlignIcon,
  TextIcon,
  UnderlineIcon,
} from "../../../components/assets";
import { toggleState, useTheme } from "../../../tools";
import { AnimatePresence, MotiScrollView, MotiView } from "moti";
import { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { useToast } from "../../../components";
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
  justifyAligned?: boolean;
  centerAligned?: boolean;
  leftAligned?: boolean;
  rightAligned?: boolean;
  focused?: boolean;
  onFontColor?: () => void;
}
export function CustomizeBar({
  backgroundOptions,
  onBold,
  onItalic,
  italicFocused,
  boldFocused,
  underLinedFocused,
  fontOptions,
  justifyAligned,
  rightAligned,
  leftAligned,
  centerAligned,
  onUnderline,
  focused,
  fontColorOptions,
  onFontColor,
}: CustomizeBarProps) {
  const [showOption, setShowOption] = useState<string | null>(null);
  const theme = useTheme();
  const keyboard = useKeyboard();
  const toast = useToast();
  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("bold");
  };

  // const isHidden =
  //   !keyboard.coordinates.end.screenY ||
  //   keyboard.coordinates.end.screenY === Dimensions.get("screen").height;
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
      default:
        return 60;
    }
  }

  function selectionWarn(additionalText?: string) {
    toast({ message: `Select text ${additionalText}`, duration: 2000 });
  }
  return (
    <MotiView
      transition={{ type: "timing", duration: 300 }}
      style={{
        width: width - 30,
        borderRadius: 16,
        backgroundColor: theme.customizeBarColor,
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        marginBottom: paddingTop + 20,
      }}
      from={{ paddingTop: 0 }}
      animate={{
        paddingTop: showOption ? optionSizeAdjust() : 0,
      }}
    >
      <AnimatePresence>
        {showOption === "background" && (
          <MotiScrollView
            horizontal
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", delay: 180, duration: 120 }}
            exit={{ opacity: 0 }}
            exitTransition={{ delay: 0 }}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 15,
              padding: 15,
            }}
            style={{
              width: "100%",
              height: 60,
              backgroundColor: theme.customizeBarColor,
              position: "absolute",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              top: 0,
            }}
          >
            {backgroundOptions}
          </MotiScrollView>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showOption === "font" && (
          <MotiScrollView
            horizontal
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", delay: 180, duration: 120 }}
            exit={{ opacity: 0 }}
            exitTransition={{ delay: 0 }}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 15,
              padding: 15,
            }}
            style={{
              width: "100%",
              height: 60,

              backgroundColor: theme.customizeBarColor,
              position: "absolute",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              top: 0,
            }}
          >
            {fontOptions}
          </MotiScrollView>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showOption === "font-color" && (
          <MotiScrollView
            horizontal
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", delay: 180, duration: 120 }}
            exit={{ opacity: 0 }}
            exitTransition={{ delay: 0 }}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 15,
              padding: 15,
            }}
            style={{
              width: "100%",
              backgroundColor: theme.customizeBarColor,
              position: "absolute",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              top: 0,
            }}
          >
            {fontColorOptions}
          </MotiScrollView>
        )}
      </AnimatePresence>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        decelerationRate={"fast"}
        contentContainerStyle={{
          padding: 15,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          columnGap: 15,
        }}
        horizontal
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        style={{
          backgroundColor: theme.customizeBarColor,
          // alignSelf: "center",
          borderRadius: 16,
        }}
        scrollEventThrottle={16}
      >
        <BoldIcon active={boldFocused} onPress={onBold} />
        <ItalicIcon active={italicFocused} onPress={onItalic} />
        <UnderlineIcon active={underLinedFocused} onPress={onUnderline} />
        <TextIcon
          onPress={() => {
            setShowOption(toggleState(null, "font"));
          }}
        />
        <FontColorIcon
          onPress={() => {
            setShowOption(toggleState(null, "font-color", onFontColor));
          }}
        />
        {/* <JustifyAlignIcon active={justifyAligned} onPress={handlePress} />
        <LeftAlignIcon active={leftAligned} onPress={handlePress} />
        <CenterAlignIcon active={centerAligned} onPress={handlePress} />
        <RightAlignIcon active={rightAligned} onPress={handlePress} /> */}
        <BackgroundIcon
          onPress={() => setShowOption(toggleState(null, "background"))}
        />
      </ScrollView>
    </MotiView>
  );
}
