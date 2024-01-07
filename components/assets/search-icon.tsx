import * as React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import { useTheme } from "../../hooks";
import { moderateScale, verticalScale } from "../../tools";

export function SearchIcon(props: any) {
  const theme = useTheme();
  return (
    <Svg
      width={moderateScale(24)}
      height={verticalScale(24)}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_2_16)">
        <Path
          d="M18.333 18.333l-1.666-1.666m-7.084.833a7.918 7.918 0 100-15.836 7.918 7.918 0 000 15.836z"
          stroke={theme.onBackgroundSearch}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2_16">
          <Path fill="#fff" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
