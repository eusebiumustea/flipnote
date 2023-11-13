import * as React from "react";
import { TouchableOpacity, ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, useTheme, verticalScale } from "../../../tools";
import { IconButtonBase } from "./types";

export function BackgroundIcon({
  svgProps,
  onPress,
  btnProps,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      {...btnProps}
      activeOpacity={0.5}
      onPress={onPress}
      style={{
        width: moderateScale(26),
        height: verticalScale(26),
      }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill={theme.primary}
        {...svgProps}
      >
        <Path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5m16 1V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" />
      </Svg>
    </TouchableOpacity>
  );
}
