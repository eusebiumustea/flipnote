import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";

export function DeleteIcon({
  svgProps,
  onPress,
  style,
  btnProps,
  color,
}: IconButtonBase) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        width: moderateScale(30),
        height: verticalScale(30),
        ...style,
      }}
      {...btnProps}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        fill={color || theme.onPrimary}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...svgProps}
      >
        <Path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2z" />
      </Svg>
    </TouchableOpacity>
  );
}
