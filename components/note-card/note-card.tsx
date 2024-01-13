import Checkbox from "expo-checkbox";
import { MotiPressable } from "moti/interactions";
import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  memo,
  useEffect,
  useRef,
} from "react";
import {
  LayoutChangeEvent,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNoteContent, useTheme } from "../../hooks";
import { note } from "../../screens/note";
import {
  deviceIsLowRam,
  moderateFontScale,
  reinjectElementInArray,
  verticalScale,
} from "../../tools";
import Animated, {
  SharedTransition,
  withTiming,
} from "react-native-reanimated";
interface NoteCardProps {
  item: note;

  onPress: () => void;
  onLongPress: () => void;
  selectedForOptions: boolean;
  options: boolean;
  deletedProgress: boolean;
}
export const NoteCard = memo(
  ({
    item,
    onPress,
    onLongPress,
    selectedForOptions,
    options,
    deletedProgress,
  }: NoteCardProps) => {
    const content = useNoteContent(item.styles, item.text);
    const { width } = useWindowDimensions();

    function scale() {
      if (deletedProgress) {
        return 0;
      }
      if (selectedForOptions && !deviceIsLowRam) {
        return 0.93;
      }
      return 1;
    }
    const theme = useTheme();
    return (
      <Animated.View
        sharedTransitionTag={item.id.toString()}
        style={{
          height: verticalScale(250),
          width: width / 2 - 16,
          borderRadius: 16,
          overflow: "hidden",
          // elevation: 5,

          // shadowColor: "#000000",
          // shadowOffset: {
          //   width: 0,
          //   height: 3,
          // },
          // shadowOpacity: 0.17,
          // shadowRadius: 3.05,
          borderWidth: 1,
          borderColor: "#b8b8b8",
        }}
      >
        <MotiPressable
          transition={{
            type: "timing",
            duration: 160,
            delay: deletedProgress ? item.id * 160 : 0,
          }}
          onLongPress={onLongPress}
          onPress={onPress}
          style={{
            backgroundColor: item.background,
            borderRadius: 16,
            height: "100%",
            width: "100%",
          }}
          from={{ scale: 1, opacity: 1 }}
          animate={{ scale: scale(), opacity: deletedProgress ? 0 : 1 }}
        >
          <View style={{ flex: 1, padding: 16, overflow: "hidden" }}>
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
        </MotiPressable>
      </Animated.View>
    );
  }
);
