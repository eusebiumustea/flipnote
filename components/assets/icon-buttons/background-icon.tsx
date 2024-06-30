import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function BackgroundIcon({ btnProps, onPress }: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer onPress={onPress} {...btnProps}>
      <MaterialIcons color={theme.textUnselected} name="image" size={24} />
    </IconButtonContainer>
  );
}
