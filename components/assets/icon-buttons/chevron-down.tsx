import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";

export function ChevronDownIcon({ svgProps, color, active }: IconButtonBase) {
  return (
    <Svg
      width={moderateScale(25)}
      height={verticalScale(25)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color || "#000"}
      {...svgProps}
    >
      <Path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z" />
    </Svg>
  );
}
