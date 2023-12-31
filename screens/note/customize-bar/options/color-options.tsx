import { Pressable, useWindowDimensions, Text } from "react-native";
import ColorPicker, {
  BrightnessSlider,
  HueSlider,
  SaturationSlider,
} from "reanimated-color-picker";
import {
  moderateFontScale,
  removeObjectKey,
  replaceElementAtIndex,
  useTheme,
} from "../../../../tools";
import { OptionProps } from "../../types";
import { FontColorEvent } from "../../style-events";

export function ColorOptions({
  currentFocused,
  currentIndex,
  selection,
  setEditNote,
}: OptionProps) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  return (
    <ColorPicker
      style={{
        rowGap: 10,
        width: width - 60,
      }}
      thumbShape="circle"
      onComplete={({ hex }) =>
        FontColorEvent(
          currentFocused,
          hex,
          selection,
          setEditNote,
          currentIndex
        )
      }
      value={
        currentFocused && currentFocused?.style?.color
          ? (currentFocused?.style?.color as string)
          : "#0213f5"
      }
    >
      <HueSlider boundedThumb />
      <SaturationSlider boundedThumb />
      <BrightnessSlider boundedThumb />
      {currentFocused?.style?.color !== undefined && (
        <Pressable
          onPress={() => {
            if (
              currentFocused &&
              Object.keys(currentFocused.style).includes("color") &&
              Object.keys(currentFocused.style).length >= 1
            ) {
              setEditNote((prev) => ({
                ...prev,
                styles:
                  Object.keys(currentFocused.style).length === 1
                    ? prev.styles.filter((e) => e !== currentFocused)
                    : replaceElementAtIndex(prev.styles, currentIndex, {
                        ...currentFocused,
                        style: removeObjectKey(currentFocused.style, "color"),
                      }),
              }));
            }
          }}
          style={{
            alignSelf: "flex-start",
            backgroundColor: theme.primary,
            padding: 5,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: theme.onPrimary }}>Reset</Text>
        </Pressable>
      )}
    </ColorPicker>
  );
}
