import { Foundation } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";
import { moderateScale } from "../../../utils";

export function LeftAlignIcon({ active }: IconButtonBase) {
  const theme = useTheme();
  return (
    <Foundation
      name="align-left"
      color={active ? theme.primary : theme.textUnselected}
      size={moderateScale(24)}
    />
  );
}
