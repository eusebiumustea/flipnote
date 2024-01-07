import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../tools";
import { IconButtonBase } from "./types";

export function FontColorIcon({
  svgProps,
  onPress,
  btnProps,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      {...btnProps}
      activeOpacity={0.5}
      onPress={onPress}
      style={{ width: moderateScale(26), height: verticalScale(26) }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 38"
        stroke={color}
        x="0px"
        y="0px"
        {...svgProps}
      >
        <Path
          d="M18.46 32h6.683L16.076 6.857H9.248L0 32h6.61l1.626-4.222h8.743L18.459 32zm-8.49-9.198l2.638-8.142 2.709 8.142H9.97zM20.571 10.213C20.571 7.017 26.286 0 26.286 0S32 7.017 32 10.213a5.824 5.824 0 01-1.674 4.092A5.678 5.678 0 0126.286 16a5.678 5.678 0 01-4.04-1.695 5.824 5.824 0 01-1.675-4.092z"
          fill={theme.primary}
        />
      </Svg>
    </TouchableOpacity>
  );
}
