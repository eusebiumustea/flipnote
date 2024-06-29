import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function HeartIcon({
  svgProps,
  onPress,
  btnProps,
  focused,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: moderateScale(30),
        height: verticalScale(30),
        justifyContent: "center",
        alignItems: "center",
      }}
      {...btnProps}
    >
      {!focused && (
        <Feather
          name="heart"
          size={24}
          color={!color ? theme.onBackground : color}
          {...svgProps}
        />
      )}
      {focused && <FontAwesome name="heart" size={24} color="red" />}
    </TouchableOpacity>
  );
}
