import { Slider } from "@miblanchard/react-native-slider";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../hooks";
import { removeObjectKey, replaceElementAtIndex } from "../../../../utils";
import { FontSizeEvent } from "../../style-events";
import { OptionProps } from "../../types";

export function FontSizeOptions({
  currentSelectedStyle,
  currentIndex,
  selection,
  setEditNote,
}: OptionProps) {
  const theme = useTheme();
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
        onSlidingComplete={(valueArr) => {
          const value = valueArr[0];
          if (value < 15 && currentSelectedStyle?.style?.fontSize) {
            setEditNote((prev) => ({
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

            return;
          }
          FontSizeEvent(
            currentSelectedStyle,
            value,
            selection,
            setEditNote,
            currentIndex
          );
        }}
        value={currentSelectedStyle?.style?.fontSize || 14}
        thumbStyle={{ backgroundColor: "teal" }}
        maximumTrackTintColor={theme.primary}
        minimumTrackTintColor={"#007AFF"}
        trackStyle={{ width: "100%" }}
        minimumValue={14}
        maximumValue={70}
      />
      {currentSelectedStyle?.style?.fontSize && (
        <>
          <TouchableOpacity
            onPress={() => {
              if (
                currentSelectedStyle &&
                Object.keys(currentSelectedStyle.style).includes("fontSize") &&
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
                            "fontSize"
                          ),
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
          </TouchableOpacity>
          <Text
            style={{
              color: theme.primary,
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 12,
            }}
          >
            {Math.round(currentSelectedStyle?.style?.fontSize)}
          </Text>
        </>
      )}
    </View>
  );
}
