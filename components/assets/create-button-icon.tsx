import * as React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, useTheme } from "../../tools";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface CreateIconProps {
  svgProps?: any;
  onPress?: () => void;
}
export function CreateIcon({ svgProps, onPress }: CreateIconProps) {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        width: moderateScale(61),
        height: moderateScale(61),
        borderRadius: 100,
        backgroundColor: theme.onPrimary,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 3,
        bottom: 0,
        right: 0,
        margin: 25,
      }}
    >
      <Svg
        {...svgProps}
        width={"100%"}
        height={"100%"}
        viewBox="0 0 39 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M9.795 19.5h19.41M19.5 29.205V9.795"
          stroke={theme.primary}
          strokeWidth={2.42614}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
