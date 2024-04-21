import * as React from "react";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../tools";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";
export function ReminderIcon({
  svgProps,
  onPress,
  btnProps,
  active,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <Pressable
      {...btnProps}
      onPress={onPress}
      style={{ width: moderateScale(30), height: verticalScale(30) }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill={theme.onPrimary}
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
      >
        {active ? (
          <Path
            fill={"teal"}
            stroke={theme.onPrimary}
            d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 012-2 2 2 0 012 2v.29c2.97.88 5 3.61 5 6.71v6l2 2m-7 2a2 2 0 01-2 2 2 2 0 01-2-2"
          />
        ) : (
          <Path d="M10 21h4c0 1.1-.9 2-2 2s-2-.9-2-2m11-2v1H3v-1l2-2v-6c0-3.1 2-5.8 5-6.7V4c0-1.1.9-2 2-2s2 .9 2 2v.3c3 .9 5 3.6 5 6.7v6l2 2m-4-8c0-2.8-2.2-5-5-5s-5 2.2-5 5v7h10v-7z" />
        )}
      </Svg>
    </Pressable>
  );
}
