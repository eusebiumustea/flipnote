import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import Feather from "@expo/vector-icons/Feather";

export function ImportIcon() {
  const theme = useTheme();
  return (
    <Feather
      name="file-plus"
      size={moderateScale(24)}
      color={theme.onPrimary}
    />
  );
}
