import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";
import Feather from "@expo/vector-icons/Feather";

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
      activeOpacity={0.4}
      style={{ width: 25, height: 25, ...style }}
      {...btnProps}
    >
      <Feather name="x" size={24} color={theme.onPrimary} {...svgProps} />
    </TouchableOpacity>
  );
}
