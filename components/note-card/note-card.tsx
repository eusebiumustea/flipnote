import Checkbox from "expo-checkbox";
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
import { useTheme } from "../../hooks";
import { NotePreviewTypes } from "../../screens/note";
import { shadows } from "../../ui-config";
import { moderateFontScale, verticalScale } from "../../utils";
import { CardBackgroundImage } from "./card-image-background";
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
    const theme = useTheme();

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
    const isImgBg = item.background?.includes("/");
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={onPress}
        style={{
          height: verticalScale(250),
          width: width / 2 - 16,
          borderRadius: 16,
          backgroundColor: isImgBg ? theme.primary : item.background,
          padding: 16,
          ...shadows(theme),
          ...containerStyle,
        }}
      >
        <CardBackgroundImage
          uri={item.background}
          overlayOpacity={item.imageOpacity}
          height={containerStyle?.height || verticalScale(250)}
          width={containerStyle?.width || width / 2 - 16}
          show={isImgBg}
        />
        <View
          style={{
            flex: 1,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {item.title && (
            <Text
              style={{
                color: defaultThemeText,
                fontSize: moderateFontScale(22),
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
              fontSize: moderateFontScale(17),
              fontFamily: "OpenSans",
              color: defaultThemeText,
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
              top: 4,
              right: 4,
              zIndex: 2,
              margin: 2,
            }}
            value={selectedForOptions}
          />
        )}
      </Pressable>
    );
  }
);
