import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";
import Feather from "@expo/vector-icons/Feather";

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
      <Feather
        name="arrow-left"
        size={32}
        color={!color ? theme.onBackground : color}
        {...svgProps}
      />
    </TouchableOpacity>
  );
}
