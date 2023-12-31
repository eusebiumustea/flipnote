import * as React from "react";
import { TouchableOpacity, ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, useTheme, verticalScale } from "../../../tools";
interface ChangeIconProps {
  svgProps?: any;
  onPress?: () => void;
  btnProps?: ViewProps;
}
export function ChangesIcon({ svgProps, onPress, btnProps }: ChangeIconProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      {...btnProps}
      activeOpacity={0.5}
      onPress={onPress}
      style={{ width: moderateScale(30), height: verticalScale(30) }}
    >
      <Svg
        fill={theme.onPrimary}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...svgProps}
      >
        <Path d="M13.5 8H12v5l4.28 2.54.72-1.21-3.5-2.08V8M13 3a9 9 0 00-9 9H1l3.96 4.03L9 12H6a7 7 0 017-7 7 7 0 017 7 7 7 0 01-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.896 8.896 0 0013 21a9 9 0 009-9 9 9 0 00-9-9" />
      </Svg>
    </TouchableOpacity>
  );
}
