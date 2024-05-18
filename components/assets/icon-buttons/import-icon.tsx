import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";

export function ImportIcon() {
  const theme = useTheme();
  return (
    <Svg
      width={moderateScale(25)}
      height={verticalScale(25)}
      viewBox="0 0 24 24"
      fill={theme.onPrimary}
    >
      <Path d="M14 2H6c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h7.81c-.53-.91-.81-1.95-.81-3 0-3.31 2.69-6 6-6 .34 0 .67.03 1 .08V8l-6-6m-1 7V3.5L18.5 9H13m10 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" />
    </Svg>
  );
}
