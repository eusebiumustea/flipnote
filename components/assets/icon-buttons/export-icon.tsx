import * as React from "react";
import { TouchableOpacity, ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, useTheme, verticalScale } from "../../../tools";
import { IconButtonBase } from "./types";

export function ExportIcon({ svgProps, onPress, btnProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      {...btnProps}
      activeOpacity={0.5}
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25) }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill={theme.onPrimary}
        {...svgProps}
      >
        <Path d="M12 1L8 5h3v9h2V5h3m2 18H6a2 2 0 01-2-2V9a2 2 0 012-2h3v2H6v12h12V9h-3V7h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
      </Svg>
    </TouchableOpacity>
  );
}
