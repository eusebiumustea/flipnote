import { Slider } from "@miblanchard/react-native-slider";
import { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../../hooks";
import {
  moderateFontScale,
  removeObjectKey,
  replaceElementAtIndex,
} from "../../../../utils";
import { FontSizeEvent } from "../../style-events";
import { OptionProps } from "../../types";

export function FontSizeOptions({
  currentSelectedStyle,
  currentIndex,
  selection,
  setEditNote,
  editNote,
}: OptionProps) {
  const theme = useTheme();

  const [showValue, setShowValue] = useState(0);
  const focusedFontSize =
    editNote.generalStyles?.fontSize || currentSelectedStyle?.style?.fontSize;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 8,
        borderRadius: 8,
        width: "100%",
      }}
    >
      <Slider
        containerStyle={{ bottom: 10 }}
        onValueChange={(value) => {
          setShowValue(Math.round(value[0]));
        }}
        renderAboveThumbComponent={(i, value) => (
          <Text
            style={{
              color: theme.primary,
              top: 5,
              right: 10,
              fontSize: moderateFontScale(12),
            }}
          >
            {Math.round(value)}
          </Text>
        )}
        onSlidingComplete={(valueArr) => {
          const value = Math.round(valueArr[0]);
          if (value < 15 && currentSelectedStyle?.style?.fontSize) {
            return setEditNote((prev) => ({
              ...prev,
              styles:
                Object.keys(currentSelectedStyle?.style).length === 1
                  ? prev.styles.filter((e) => e !== currentSelectedStyle)
                  : replaceElementAtIndex(prev.styles, currentIndex, {
                      ...currentSelectedStyle,
                      style: removeObjectKey(
                        currentSelectedStyle?.style,
                        "fontSize"
                      ),
                    }),
            }));
          }
          if (selection.end > selection.start) {
            return FontSizeEvent(
              currentSelectedStyle,
              value,
              selection,
              setEditNote,
              currentIndex
            );
          }
          setEditNote((prev) => ({
            ...prev,
            generalStyles:
              value < 15
                ? removeObjectKey(prev.generalStyles, "fontSize")
                : { ...prev.generalStyles, fontSize: value },
          }));
        }}
        value={
          currentSelectedStyle?.style?.fontSize ||
          editNote.generalStyles?.fontSize ||
          14
        }
        thumbStyle={{ backgroundColor: "teal" }}
        maximumTrackTintColor={theme.primary}
        minimumTrackTintColor={"#007AFF"}
        trackStyle={{ width: "100%" }}
        minimumValue={14}
        maximumValue={70}
      />
      {focusedFontSize && (
        <Text
          onPress={() => {
            if (
              currentSelectedStyle &&
              Object.keys(currentSelectedStyle.style).includes("fontSize") &&
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
                          "fontSize"
                        ),
                      }),
              }));
            }
            setEditNote((prev) => ({
              ...prev,
              generalStyles: removeObjectKey(prev.generalStyles, "fontSize"),
            }));
          }}
          style={{
            color: theme.primary,
            alignSelf: "flex-start",
            position: "absolute",
            bottom: 0,
          }}
        >
          Reset
        </Text>
      )}
    </View>
  );
}
