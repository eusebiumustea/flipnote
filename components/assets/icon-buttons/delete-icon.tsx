import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import Feather from "@expo/vector-icons/Feather";

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
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      {...btnProps}
    >
      <Feather
        name="trash-2"
        size={moderateScale(24)}
        color={color || theme.onPrimary}
        {...svgProps}
      />
    </TouchableOpacity>
  );
}
