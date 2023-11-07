import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, useTheme, verticalScale } from "../../tools";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface DeleteIconProps {
  svgProps?: any;
  onPress?: () => void;
}

export function DeleteIcon({ svgProps, onPress }: DeleteIconProps) {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: moderateScale(30),
        height: verticalScale(30),
      }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        fill={theme.onPrimary}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...svgProps}
      >
        <Path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2z" />
      </Svg>
    </TouchableOpacity>
  );
}
