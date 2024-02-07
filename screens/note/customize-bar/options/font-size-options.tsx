import { Slider } from "@miblanchard/react-native-slider";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useTheme } from "../../../../hooks";
import { removeObjectKey, replaceElementAtIndex } from "../../../../tools";
import { FontSizeEvent } from "../../style-events";
import { OptionProps } from "../../types";

export function FontSizeOptions({
  currentFocused,
  currentIndex,
  selection,
  setEditNote,
}: OptionProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
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
      {/* <Slider
        thumbTintColor={theme.primary}
        maximumTrackTintColor="green"
        style={{
          width: width - 60,
          borderRadius: 8,

          backgroundColor: "orange",
        }}
        minimumValue={14}
        maximumValue={70}
        minimumTrackTintColor="blue"
        value={currentFocused?.style?.fontSize || 14}
        onValueChange={(value) => (showValue.current = value)}
        onSlidingComplete={(value) => {
          if (value < 15) {
            setEditNote((prev) => ({
              ...prev,
              styles:
                Object.keys(currentFocused.style).length === 1
                  ? prev.styles.filter((e) => e !== currentFocused)
                  : replaceElementAtIndex(prev.styles, currentIndex, {
                      ...currentFocused,
                      style: removeObjectKey(currentFocused.style, "fontSize"),
                    }),
            }));
            return;
          }
          FontSizeEvent(
            currentFocused,
            value,
            selection,
            setEditNote,
            currentIndex
          );
        }}
      /> */}
      <Slider
        onSlidingComplete={(valueArr) => {
          const value = valueArr[0];
          if (value < 15 && currentFocused?.style?.fontSize) {
            setEditNote((prev) => ({
              ...prev,
              styles:
                Object.keys(currentFocused?.style).length === 1
                  ? prev.styles.filter((e) => e !== currentFocused)
                  : replaceElementAtIndex(prev.styles, currentIndex, {
                      ...currentFocused,
                      style: removeObjectKey(currentFocused?.style, "fontSize"),
                    }),
            }));

            return;
          }
          FontSizeEvent(
            currentFocused,
            value,
            selection,
            setEditNote,
            currentIndex
          );
        }}
        value={currentFocused?.style?.fontSize || 14}
        thumbStyle={{ backgroundColor: "teal" }}
        maximumTrackTintColor={theme.primary}
        minimumTrackTintColor={"#007AFF"}
        trackStyle={{ width: "100%" }}
        minimumValue={14}
        maximumValue={70}
      />
      {currentFocused?.style?.fontSize && (
        <>
          <Pressable
            onPress={() => {
              if (
                currentFocused &&
                Object.keys(currentFocused.style).includes("fontSize") &&
                Object.keys(currentFocused.style).length >= 1
              ) {
                setEditNote((prev) => ({
                  ...prev,
                  styles:
                    Object.keys(currentFocused.style).length === 1
                      ? prev.styles.filter((e) => e !== currentFocused)
                      : replaceElementAtIndex(prev.styles, currentIndex, {
                          ...currentFocused,
                          style: removeObjectKey(
                            currentFocused.style,
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
          </Pressable>
          <Text
            style={{
              color: theme.primary,
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 12,
            }}
          >
            {Math.round(currentFocused?.style?.fontSize)}
          </Text>
        </>
      )}
    </View>
  );
}
