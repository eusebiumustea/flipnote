import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import Feather from "@expo/vector-icons/Feather";

export function MenuIcon({ svgProps, onPress, btnProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25) }}
      {...btnProps}
    >
      <Feather name="menu" size={moderateScale(24)} color={theme.onPrimary} />
    </TouchableOpacity>
  );
}
