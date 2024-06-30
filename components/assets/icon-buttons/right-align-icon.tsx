import { Foundation } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";
import { moderateScale } from "../../../utils";

export function RightAlignIcon({ active }: IconButtonBase) {
  const theme = useTheme();
  return (
    <Foundation
      name="align-right"
      size={moderateScale(24)}
      color={active ? theme.primary : theme.textUnselected}
    />
  );
}
