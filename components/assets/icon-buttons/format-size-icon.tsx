import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";
import { moderateScale } from "../../../utils";

export function FormatSizeIcon({ onPress }: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer onPress={onPress}>
      <MaterialIcons
        size={moderateScale(24)}
        name="format-size"
        color={theme.textUnselected}
      />
    </IconButtonContainer>
  );
}
