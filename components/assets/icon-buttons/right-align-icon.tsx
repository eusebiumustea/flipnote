import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";

export function RightAlignIcon({
  svgProps,
  onPress,
  btnProps,
  active,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <Svg
      width={moderateScale(25)}
      height={verticalScale(25)}
      viewBox="0 0 24 24"
      fill="none"
      {...svgProps}
    >
      <Path
        d="M12 4.5h9m-9 5h9m-18 5h18m-18 5h18"
        stroke={active ? theme.primary : theme.textUnselected}
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
