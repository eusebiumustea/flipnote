import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../hooks";
import {
  moderateFontScale,
  removeObjectKey,
  replaceElementAtIndex,
} from "../../../../utils";
import { FontFamilyEvent } from "../../style-events";
import { OptionProps } from "../../types";

export function FontOptions({
  fonts,
  setEditNote,
  fontFamilyFocused,
  currentSelectedStyle,
  currentIndex,
  selection,
}: OptionProps) {
  const theme = useTheme();

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      horizontal
      style={{ alignSelf: "flex-start" }}
      contentContainerStyle={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: 16,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (
            currentSelectedStyle &&
            currentSelectedStyle?.style?.fontFamily !== undefined &&
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
                        "fontFamily"
                      ),
                    }),
            }));
            return;
          }
          setEditNote((prev) => ({
            ...prev,
            generalStyles: { ...prev.generalStyles, fontFamily: "" },
          }));
          // setEditNote((prev) => ({
          //   ...prev,
          //   generalStyles: removeObjectKey(prev.generalStyles, "fontFamily"),
          // }));
        }}
        style={{
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            color: theme.primary,
            fontSize: moderateFontScale(16),
          }}
        >
          {"Default"}
        </Text>
        {!fontFamilyFocused && (
          <View
            style={{
              width: "100%",
              height: 3,
              backgroundColor: theme.primary,
            }}
          />
        )}
      </TouchableOpacity>
      {fonts.map((font, i) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (selection.end > selection.start) {
                return FontFamilyEvent(
                  currentSelectedStyle,
                  font,
                  selection,
                  setEditNote,
                  currentIndex
                );
              }
              setEditNote((prev) => ({
                ...prev,
                generalStyles: { ...prev.generalStyles, fontFamily: font },
              }));
            }}
            style={{
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
            key={i}
          >
            <Text
              style={{
                color: theme.primary,
                fontFamily: font,
                fontSize: moderateFontScale(18),
              }}
            >
              {font}
            </Text>
            {fontFamilyFocused === font && (
              <View
                style={{
                  width: "100%",
                  height: 3,
                  backgroundColor: theme.primary,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
