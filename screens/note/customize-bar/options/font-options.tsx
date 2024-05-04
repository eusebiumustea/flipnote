import { useCallback } from "react";
import { TouchableOpacity, Text, View } from "react-native";
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
    <>
      <TouchableOpacity
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
          }
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
            onPress={() =>
              FontFamilyEvent(
                currentSelectedStyle,
                font,
                selection,
                setEditNote,
                currentIndex
              )
            }
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
    </>
  );
}
