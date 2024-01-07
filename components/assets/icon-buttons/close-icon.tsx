import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";

export function CloseIcon({
  svgProps,
  onPress,
  btnProps,
  style,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.2}
      style={{ width: 25, height: 25, ...style }}
      {...btnProps}
    >
      <Svg
        fill={theme.onPrimary}
        width={"100%"}
        height={"100%"}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...svgProps}
      >
        <Path d="M13.46 12L19 17.54V19h-1.46L12 13.46 6.46 19H5v-1.46L10.54 12 5 6.46V5h1.46L12 10.54 17.54 5H19v1.46L13.46 12z" />
      </Svg>
    </TouchableOpacity>
  );
}
