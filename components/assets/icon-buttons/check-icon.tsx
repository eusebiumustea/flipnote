import * as React from "react";
import {
  ColorValue,
  TouchableOpacity,
  ViewProps,
  ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, useTheme, verticalScale } from "../../../tools";
interface CheckIconProps {
  svgProps?: any;
  onPress?: () => void;
  btnProps?: ViewProps;
  focused?: boolean;
  style?: ViewStyle;
  fill?: ColorValue;
}
export function CheckIcon({
  svgProps,
  onPress,
  btnProps,
  focused,
  style,
  fill = "#000",
}: CheckIconProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        width: moderateScale(25),
        height: verticalScale(25),
        ...style,
      }}
      {...btnProps}
    >
      <Svg
        fill={fill}
        width={"100%"}
        height={"100%"}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...svgProps}
      >
        {focused ? (
          <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        ) : (
          <Path d="M12 20a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8m0-18A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z" />
        )}
      </Svg>
    </TouchableOpacity>
  );
}
