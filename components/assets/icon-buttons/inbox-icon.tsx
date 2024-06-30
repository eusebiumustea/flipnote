import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function InboxIcon({
  style,
  svgProps,
  btnProps,
  active,
  onPress,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25), ...style }}
      {...btnProps}
    >
      <Feather name="bell" size={moderateScale(24)} color={theme.onPrimary} />
      {active && (
        <Svg
          width={"100%"}
          height={"100%"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform={[{ translateY: -moderateScale(24) }]}
          {...svgProps}
        >
          <Circle cx={16.5} cy={4.5} r={4.5} fill="#2AFF8C" />
        </Svg>
      )}
    </IconButtonContainer>
  );
}
