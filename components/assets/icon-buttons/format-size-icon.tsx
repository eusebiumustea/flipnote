import * as React from "react";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../tools";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";

export function FormatSizeIcon({
  svgProps,
  onPress,
  btnProps,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <Pressable
      {...btnProps}
      onPress={onPress}
      style={{ width: moderateScale(27), height: verticalScale(27) }}
    >
      <Svg width={"100%"} height={"100%"} viewBox="0 0 24 24" {...svgProps}>
        <Path
          fill={theme.primary}
          d="M2 4v3h5v12h3V7h5V4H2m19 5h-9v3h3v7h3v-7h3V9z"
        />
      </Svg>
    </Pressable>
  );
}
