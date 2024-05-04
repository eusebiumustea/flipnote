import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";

export function ImportIcon({ svgProps, onPress, btnProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25) }}
      {...btnProps}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill={theme.onPrimary}
        {...svgProps}
      >
        <Path d="M14 2H6c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h7.81c-.53-.91-.81-1.95-.81-3 0-3.31 2.69-6 6-6 .34 0 .67.03 1 .08V8l-6-6m-1 7V3.5L18.5 9H13m10 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" />
      </Svg>
    </TouchableOpacity>
  );
}
