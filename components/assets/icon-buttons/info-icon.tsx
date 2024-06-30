import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";
import { moderateScale } from "../../../utils";

export function InfoIcon({
  svgProps,
  onPress,
  btnProps,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer onPress={onPress} {...btnProps}>
      <Feather
        name="info"
        size={moderateScale(24)}
        color={!color ? theme.onPrimary : color}
        {...svgProps}
      />
    </IconButtonContainer>
  );
}
