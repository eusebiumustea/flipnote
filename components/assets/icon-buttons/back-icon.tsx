import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";

export function BackIcon({
  svgProps,
  onPress,
  btnProps,
  style,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: 37,
        height: 37,
        ...style,
      }}
      {...btnProps}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
      >
        <Path
          d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67"
          stroke={!color ? theme.onBackground : color}
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
