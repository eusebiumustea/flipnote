import * as React from "react";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "../../../hooks";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function BackIcon({
  svgProps,
  btnProps,
  style,
  color,
  onPress,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer
      onPress={onPress}
      style={{ width: 37, height: 37, ...style }}
      {...btnProps}
    >
      <Feather
        name="arrow-left"
        size={32}
        color={!color ? theme.onBackground : color}
        {...svgProps}
      />
    </IconButtonContainer>
  );
}
