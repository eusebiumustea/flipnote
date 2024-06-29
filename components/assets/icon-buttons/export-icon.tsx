import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import Feather from "@expo/vector-icons/Feather";

export function ExportIcon({ svgProps, onPress, btnProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25) }}
      {...btnProps}
    >
      <Feather
        name="share"
        size={moderateScale(24)}
        color={theme.onPrimary}
        {...svgProps}
      />
    </TouchableOpacity>
  );
}
