import { Pressable, Text, View } from "react-native";
import { OptionProps } from "../../types";
import {
  moderateFontScale,
  removeObjectKey,
  replaceElementAtIndex,
} from "../../../../tools";
import { FontFamilyEvent } from "../../style-events";
import { useTheme } from "../../../../hooks";

export function FontOptions({
  fonts,
  setEditNote,
  fontFamilyFocused,
  currentFocused,
  currentIndex,
  selection,
}: OptionProps) {
  const theme = useTheme();

  return (
    <>
      <Pressable
        onPress={() => {
          if (
            currentFocused &&
            currentFocused?.style?.fontFamily !== undefined &&
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
      </Pressable>
      {fonts.map((font, i) => {
        return (
          <Pressable
            onPress={() =>
              FontFamilyEvent(
                currentFocused,
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
          </Pressable>
        );
      })}
    </>
  );
}
