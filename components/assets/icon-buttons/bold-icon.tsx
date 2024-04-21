import * as React from "react";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../tools";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";

export function BoldIcon({
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
      style={{ width: moderateScale(25), height: verticalScale(25) }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill="none"
        {...svgProps}
      >
        <Path
          d="M4.88 12H12c2.62 0 4.75-2.13 4.75-4.75S14.62 2.5 12 2.5H6.88c-1.1 0-2 .9-2 2V12zm0 0h9.5c2.62 0 4.75 2.13 4.75 4.75S17 21.5 14.38 21.5h-7.5c-1.1 0-2-.9-2-2V12z"
          stroke={active ? theme.primary : theme.textUnselected}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}
