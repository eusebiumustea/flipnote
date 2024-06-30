import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function CloseIcon({
  svgProps,
  onPress,
  btnProps,
  style,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer
      onPress={onPress}
      activeOpacity={0.4}
      style={{ width: 25, height: 25, ...style }}
      {...btnProps}
    >
      <Feather name="x" size={24} color={theme.onPrimary} {...svgProps} />
    </IconButtonContainer>
  );
}
