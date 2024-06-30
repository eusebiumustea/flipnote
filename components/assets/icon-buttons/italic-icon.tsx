import { Octicons } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";
import { moderateScale } from "../../../utils";

export function ItalicIcon({ active }: IconButtonBase) {
  const theme = useTheme();
  return (
    <Octicons
      color={active ? theme.primary : theme.textUnselected}
      size={moderateScale(24)}
      name="italic"
    />
  );
}
