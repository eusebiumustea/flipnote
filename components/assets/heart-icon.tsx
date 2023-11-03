import * as React from "react";
import { TouchableOpacity, ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, useTheme, verticalScale } from "../../tools";
interface HeartIconProps {
  svgProps?: any;
  onPress?: () => void;
  btnProps?: ViewProps;
}
export function HeartIcon({ svgProps, onPress, btnProps }: HeartIconProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      {...btnProps}
      activeOpacity={0.5}
      onPress={onPress}
      style={{ width: moderateScale(30), height: verticalScale(30) }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
      >
        <Path
          d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 014.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12z"
          stroke={theme.onBackground}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
