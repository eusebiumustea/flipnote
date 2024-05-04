import { TouchableOpacity, Text, useWindowDimensions } from "react-native";
import ColorPicker, {
  BrightnessSlider,
  HueSlider,
  SaturationSlider,
} from "reanimated-color-picker";
import { useTheme } from "../../../../hooks";
import { removeObjectKey, replaceElementAtIndex } from "../../../../utils";
import { FontColorEvent } from "../../style-events";
import { OptionProps } from "../../types";

export function ColorOptions({
  currentSelectedStyle,
  currentIndex,
  selection,
  setEditNote,
}: OptionProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  return (
    <ColorPicker
      style={{
        rowGap: 10,
        width: "100%",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      thumbShape="circle"
      onComplete={({ hex }) =>
        FontColorEvent(
          currentSelectedStyle,
          hex,
          selection,
          setEditNote,
          currentIndex
        )
      }
      value={
        currentSelectedStyle && currentSelectedStyle?.style?.color
          ? (currentSelectedStyle?.style?.color as string)
          : "#0213f5"
      }
    >
      <HueSlider boundedThumb />
      <SaturationSlider boundedThumb />
      <BrightnessSlider boundedThumb />
      {currentSelectedStyle?.style?.color !== undefined && (
        <Text
          onPress={() => {
            if (
              currentSelectedStyle &&
              Object.keys(currentSelectedStyle.style).includes("color") &&
              Object.keys(currentSelectedStyle.style).length >= 1
            ) {
              setEditNote((prev) => ({
                ...prev,
                styles:
                  Object.keys(currentSelectedStyle.style).length === 1
                    ? prev.styles.filter((e) => e !== currentSelectedStyle)
                    : replaceElementAtIndex(prev.styles, currentIndex, {
                        ...currentSelectedStyle,
                        style: removeObjectKey(
                          currentSelectedStyle.style,
                          "color"
                        ),
                      }),
              }));
            }
          }}
          style={{
            color: theme.onPrimary,
            alignSelf: "flex-start",
            backgroundColor: theme.primary,
            padding: 5,
            borderRadius: 20,
          }}
        >
          Reset
        </Text>
      )}
    </ColorPicker>
  );
}
