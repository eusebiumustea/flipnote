import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import { TouchableOpacity } from "react-native";

export function InfoIcon({
  svgProps,
  onPress,
  btnProps,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: moderateScale(27), height: verticalScale(28) }}
      {...btnProps}
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
          fill={!color ? theme.onPrimary : color}
          d="M12.3 7.29c.2-.18.44-.29.7-.29.27 0 .5.11.71.29.19.21.29.45.29.71 0 .27-.1.5-.29.71-.21.19-.44.29-.71.29-.26 0-.5-.1-.7-.29-.19-.21-.3-.44-.3-.71 0-.26.11-.5.3-.71m-2.5 4.68s2.17-1.72 2.96-1.79c.74-.06.59.79.52 1.23l-.01.06c-.14.53-.31 1.17-.48 1.78-.38 1.39-.75 2.75-.66 3 .1.34.72-.09 1.17-.39.06-.04.11-.08.16-.11 0 0 .08-.08.16.03.02.03.04.06.06.08.09.14.14.19.02.27l-.04.02c-.22.15-1.16.81-1.54 1.05-.41.27-1.98 1.17-1.74-.58.21-1.23.49-2.29.71-3.12.41-1.5.59-2.18-.33-1.59-.37.22-.59.36-.72.45-.11.08-.12.08-.19-.05l-.03-.06-.05-.08c-.07-.1-.07-.11.03-.2M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10m-2 0c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8 8-3.58 8-8z"
        />
      </Svg>
    </TouchableOpacity>
  );
}