import { useKeyboard } from "@react-native-community/hooks";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { moderateScale } from "../../../tools";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";
import Animated from "react-native-reanimated";

export function CreateIcon({ svgProps, onPress }: IconButtonBase) {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        width: moderateScale(61),
        height: moderateScale(61),
        borderRadius: 100,
        backgroundColor: theme.onPrimary,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 3,
        bottom: keyboard.keyboardShown ? -keyboard.keyboardHeight : 0,
        right: 0,
        margin: 30,
        elevation: 10,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
      }}
    >
      <Svg
        {...svgProps}
        width={45}
        height={45}
        viewBox="0 0 39 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M9.795 19.5h19.41M19.5 29.205V9.795"
          stroke={theme.primary}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
