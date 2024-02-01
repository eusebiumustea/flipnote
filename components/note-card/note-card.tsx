import Checkbox from "expo-checkbox";
import React, { memo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../../hooks";
import { NotePreviewTypes } from "../../screens/note";
import { moderateFontScale, verticalScale } from "../../tools";
import { darkCardColors } from "../../tools/colors";
interface NoteCardProps {
  item: NotePreviewTypes;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: () => void;
  selectedForOptions?: boolean;
  options?: boolean;
  containerStyle?: ViewStyle;
}
export const NoteCard = memo(
  ({
    item,
    onPress,
    onLongPress,
    selectedForOptions,
    options,
    containerStyle,
  }: NoteCardProps) => {
    const { width } = useWindowDimensions();
    const theme = useTheme();
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={onPress}
        style={{
          height: verticalScale(250),
          width: width / 2 - 16,
          borderRadius: 16,
          padding: 16,
          elevation: 7,
          shadowColor: theme.onPrimary,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          backgroundColor: item.background.includes("/")
            ? "#fff"
            : item.background,
          ...containerStyle,
        }}
      >
        {item.background.includes("/") && (
          <Image
            transition={{ duration: 500 }}
            source={{ uri: item.background }}
            style={{
              height: containerStyle?.height
                ? containerStyle?.height
                : verticalScale(250),
              width: containerStyle?.width
                ? containerStyle?.width
                : width / 2 - 16,
              borderRadius: 16,
              position: "absolute",
              zIndex: -1,
              top: 0,
            }}
          />
        )}
        <View style={{ overflow: "hidden", flex: 1 }}>
          {item.title && (
            <Text
              style={{
                color: darkCardColors.includes(item.background)
                  ? "#ffffff"
                  : "#000000",
                fontSize: moderateFontScale(20),
                fontWeight: "bold",
                fontFamily: "OpenSans",
                maxHeight: verticalScale(250),
              }}
            >
              {item.title}
            </Text>
          )}
          <Text
            style={{
              fontSize: moderateFontScale(14),
              fontFamily: "OpenSans",
              color: darkCardColors.includes(item.background) ? "#fff" : "#000",
            }}
          >
            {item.text}
          </Text>
        </View>

        {options && (
          <Checkbox
            style={{
              position: "absolute",
              borderRadius: 100,
              top: 0,
              left: 0,
              zIndex: 2,
              margin: 2,
            }}
            value={selectedForOptions}
          />
        )}
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
      </Pressable>
    );
  }
);
