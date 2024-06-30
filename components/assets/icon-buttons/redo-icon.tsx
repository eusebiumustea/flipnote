import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";

export function RedoIcon({ svgProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <Svg
      width={moderateScale(27)}
      height={verticalScale(27)}
      viewBox="0 0 24 24"
      {...svgProps}
    >
      <Path
        fill={theme.primary}
        d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8.002 8.002 0 017.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
      />
    </Svg>
  );
}
