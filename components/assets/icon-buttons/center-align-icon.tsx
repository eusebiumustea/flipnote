import { Foundation } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";
import { moderateScale } from "../../../utils";

export function CenterAlignIcon({ active }: IconButtonBase) {
  const theme = useTheme();
  return (
    <Foundation
      name="align-center"
      size={moderateScale(24)}
      color={active ? theme.primary : theme.textUnselected}
    />
  );
}
