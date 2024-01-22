import Checkbox from "expo-checkbox";
import { MotiView } from "moti";
import React, { memo } from "react";
import {
  GestureResponderEvent,
  Image,
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
          backgroundColor: item.background,
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 16,
            position: "absolute",
            zIndex: 2,
            top: 0,
          }}
        />
        <Image
          source={{ uri: item.background }}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 16,
            position: "absolute",
            zIndex: -1,
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
              zIndex: 2,
            }}
            value={selectedForOptions}
          />
        )}

        <MotiView
          from={{ opacity: 0 }}
          animate={{ backgroundColor: item.background, opacity: 1 }}
          style={{
            height: "100%",
            width: "100%",
            overflow: "hidden",
            padding: 16,
            borderRadius: 16,
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
        </MotiView>
      </Pressable>
    );
  }
);
