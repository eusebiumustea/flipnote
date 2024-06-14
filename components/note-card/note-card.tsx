import Checkbox from "expo-checkbox";
import { Image } from "expo-image";
import React, { memo, useMemo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Text } from "react-native-fast-text";
import { darkCardColors } from "../../constants/colors";
import { useStyle } from "../../hooks/use-style";
import { NotePreviewTypes } from "../../screens/note";
import { moderateFontScale, verticalScale } from "../../utils";
import { noteCardStyles } from "./styles";
interface NoteCardProps {
  item?: NotePreviewTypes;
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
    const styles = useStyle(noteCardStyles);
    const defaultThemeText = useMemo(() => {
      if (item.imageOpacity > 0.4) {
        return "#ffffff";
      }
      if (darkCardColors.includes(item.background)) {
        return "#ffffff";
      } else {
        return "#000000";
      }
    }, [item.imageOpacity, item.background]);
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={onPress}
        style={styles.root({ width, item, containerStyle })}
      >
        {item.background?.includes("/") && (
          <>
            <View
              style={{
                height: containerStyle?.height || verticalScale(250),
                width: containerStyle?.width || width / 2 - 16,
                position: "absolute",
                zIndex: -1,
                top: 0,
                borderRadius: 14,
                backgroundColor: "#000",
                opacity: item.imageOpacity,
              }}
            />
            <Image
              transition={{ duration: 100 }}
              source={{ uri: item.background }}
              style={{
                height: containerStyle?.height || verticalScale(250),
                width: containerStyle?.width || width / 2 - 16,
                borderRadius: 16,
                position: "absolute",
                zIndex: -2,
                top: 0,
              }}
            />
          </>
        )}

        {item.title && (
          <Text
            style={{
              color: defaultThemeText,
              fontSize: moderateFontScale(22),
              fontWeight: "bold",
              fontFamily: "OpenSans",
              maxHeight: verticalScale(250),
              textAlign: item.contentPosition,
            }}
          >
            {item.title}
          </Text>
        )}
        <Text
          style={{
            fontSize: moderateFontScale(17),
            fontFamily: "OpenSans",
            color: defaultThemeText,
            textAlign: item.contentPosition,
          }}
        >
          {item.text}
        </Text>

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
