import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";
import { moderateScale } from "../../../utils";

export function UnderlineIcon({ active }: IconButtonBase) {
  const theme = useTheme();
  return (
    <MaterialIcons
      color={active ? theme.primary : theme.textUnselected}
      name="format-underlined"
      size={moderateScale(24)}
    />
  );
}
