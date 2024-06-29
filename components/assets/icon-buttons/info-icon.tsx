import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export function InfoIcon({
  svgProps,
  onPress,
  btnProps,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: moderateScale(27),
        height: verticalScale(28),
        justifyContent: "center",
        alignItems: "center",
      }}
      {...btnProps}
    >
      <Feather
        name="info"
        size={24}
        color={!color ? theme.onPrimary : color}
        {...svgProps}
      />
    </TouchableOpacity>
  );
}
