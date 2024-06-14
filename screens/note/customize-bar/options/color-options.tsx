import { Text } from "react-native";
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
  defaultTextColor,
  editNote,
}: OptionProps) {
  const theme = useTheme();
  const generalStyles =
    selection.end === selection.start && editNote.generalStyles;
  const focusedColor =
    generalStyles?.color !== undefined ||
    currentSelectedStyle?.style?.color !== undefined;
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
      onComplete={({ hex }) => {
        if (selection.end > selection.start) {
          return FontColorEvent(
            currentSelectedStyle,
            hex,
            selection,
            setEditNote,
            currentIndex
          );
        }
        if (hex === defaultTextColor) {
          setEditNote((prev) => ({
            ...prev,
            generalStyles: removeObjectKey(prev.generalStyles, "color"),
          }));
        } else {
          setEditNote((prev) => ({
            ...prev,
            generalStyles: { ...prev.generalStyles, color: hex },
          }));
        }
      }}
      value={
        (currentSelectedStyle?.style?.color as string) ||
        (generalStyles?.color as string) ||
        defaultTextColor
      }
    >
      <HueSlider boundedThumb />
      <SaturationSlider boundedThumb />
      <BrightnessSlider boundedThumb />
      {focusedColor && (
        <Text
          onPress={() => {
            if (
              currentSelectedStyle &&
              Object.keys(currentSelectedStyle.style).includes("color") &&
              Object.keys(currentSelectedStyle.style).length >= 1
            ) {
              return setEditNote((prev) => ({
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
            setEditNote((prev) => ({
              ...prev,
              generalStyles: removeObjectKey(prev.generalStyles, "color"),
            }));
          }}
          style={{
            color: theme.primary,
            alignSelf: "flex-start",
            padding: 5,
            zIndex: 1,
          }}
        >
          Reset
        </Text>
      )}
    </ColorPicker>
  );
}
