import Checkbox from "expo-checkbox";
import React, { memo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNoteContent, useTheme } from "../../hooks";
import { note } from "../../screens/note";
import { moderateFontScale, verticalScale } from "../../tools";
interface NoteCardProps {
  item: note;
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: () => void;
  selectedForOptions: boolean;
  options: boolean;
}
export const NoteCard = memo(
  ({
    item,
    onPress,
    onLongPress,
    selectedForOptions,
    options,
  }: NoteCardProps) => {
    const content = useNoteContent(item.styles, item.text);
    const { width } = useWindowDimensions();

    function scale() {
      if (selectedForOptions) {
        return 0.93;
      }
      return 1;
    }
    const theme = useTheme();
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={onPress}
        style={{
          backgroundColor: item.background,
          height: verticalScale(250),
          width: width / 2 - 16,
          borderRadius: 16,

          elevation: 7,

          shadowColor: theme.onPrimary,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          padding: 16,
        }}
      >
        <View
          style={{
            height: verticalScale(250),
            width: width / 2 - 16,
            borderRadius: 16,
            position: "absolute",
            zIndex: 1,
            top: 0,
          }}
        />
        {options && (
          <Checkbox
            style={{
              position: "absolute",
              borderRadius: 100,
              top: 0,
              left: 0,
            }}
            value={selectedForOptions}
          />
        )}

        <View
          style={{
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {item.title && (
            <Text
              style={{
                color: "#000",
                fontSize: moderateFontScale(20),
                fontWeight: "bold",
                fontFamily: "OpenSans",
              }}
            >
              {item.title}
            </Text>
          )}
          {content}
        </View>
      </Pressable>
    );
  }
);
