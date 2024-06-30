import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function ShareIcon({
  svgProps,
  onPress,
  btnProps,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer
      onPress={onPress}
      style={{
        width: moderateScale(30),
        height: verticalScale(30),
        justifyContent: "center",
        alignItems: "center",
      }}
      {...btnProps}
    >
      <Feather
        name="share"
        size={moderateScale(24)}
        color={!color ? theme.onBackground : color}
        {...svgProps}
      />
    </IconButtonContainer>
  );
}
