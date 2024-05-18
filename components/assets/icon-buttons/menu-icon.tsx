import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";

export function MenuIcon({ svgProps, onPress, btnProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25) }}
      {...btnProps}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        fill={theme.onPrimary}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...svgProps}
      >
        <Path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2m0 2a8 8 0 00-8 8 8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8m0 6.5a1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5 1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5m-4.5 0A1.5 1.5 0 019 12a1.5 1.5 0 01-1.5 1.5A1.5 1.5 0 016 12a1.5 1.5 0 011.5-1.5m9 0A1.5 1.5 0 0118 12a1.5 1.5 0 01-1.5 1.5A1.5 1.5 0 0115 12a1.5 1.5 0 011.5-1.5z" />
      </Svg>
    </TouchableOpacity>
  );
}
