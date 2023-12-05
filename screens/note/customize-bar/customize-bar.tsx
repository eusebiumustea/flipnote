import { useKeyboard } from "@react-native-community/hooks";
import {
  ColorValue,
  Dimensions,
  GestureResponderEvent,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import {
  BackgroundIcon,
  BoldIcon,
  CenterAlignIcon,
  ItalicIcon,
  JustifyAlignIcon,
  LeftAlignIcon,
  RightAlignIcon,
  TextIcon,
  UnderlineIcon,
} from "../../../components/assets";
import { toggleState, useTheme } from "../../../tools";
import { AnimatePresence, MotiScrollView, MotiView } from "moti";
import { PropsWithChildren, ReactNode, useState } from "react";
interface CustomizeBarProps {
  boldFocused?: boolean;
  italicFocused?: boolean;
  onBold?: () => void;
  onItalic?: () => void;
  backgroundOptions?: PropsWithChildren<ReactNode>;
}
export function CustomizeBar({
  backgroundOptions,
  onBold,
  onItalic,
  italicFocused,
  boldFocused,
}: CustomizeBarProps) {
  const [showOption, setShowOption] = useState<string | null>(null);
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
  const { width } = useWindowDimensions();
  const paddingTop =
    Dimensions.get("screen").height -
    (keyboard.coordinates.end.screenY || Dimensions.get("screen").height);

  return (
    <MotiView
      transition={{ type: "timing", duration: 300 }}
      style={{
        width: width - 30,
        borderRadius: 16,
        backgroundColor: theme.customizeBarColor,
        position: "absolute",
        bottom: 0,
        marginBottom: paddingTop + 20,
        alignSelf: "center",
      }}
      from={{ paddingTop: 0 }}
      animate={{ paddingTop: showOption ? 60 : 0 }}
    >
      <AnimatePresence>
        {showOption === "background" && (
          <MotiScrollView
            horizontal
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", delay: 300, duration: 120 }}
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
          alignSelf: "center",
          borderRadius: 16,
        }}
        scrollEventThrottle={16}
      >
        <BoldIcon active={boldFocused} onPress={onBold} />
        <ItalicIcon active={italicFocused} onPress={onItalic} />
        <UnderlineIcon onPress={handlePress} />
        <TextIcon onPress={handlePress} />
        <JustifyAlignIcon onPress={handlePress} />
        <LeftAlignIcon onPress={handlePress} />
        <CenterAlignIcon onPress={handlePress} />
        <RightAlignIcon onPress={handlePress} />
        <BackgroundIcon
          onPress={() => setShowOption(toggleState(null, "background"))}
        />
      </ScrollView>
    </MotiView>
  );
}
