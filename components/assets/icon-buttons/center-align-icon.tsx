import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import { useTheme } from "../../../hooks";

export function CenterAlignIcon({
  svgProps,
  onPress,
  btnProps,
  active,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <View
      style={{ width: moderateScale(25), height: verticalScale(25) }}
      {...btnProps}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill="none"
        {...svgProps}
      >
        <Path
          d="M3 4.5h18m-13.74 5h9.48M3 14.5h18m-13.74 5h9.48"
          stroke={active ? theme.primary : theme.textUnselected}
          strokeWidth={active ? 2 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
