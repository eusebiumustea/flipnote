import { Octicons } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { IconButtonBase } from "./types";

export function BoldIcon({ active }: IconButtonBase) {
  const theme = useTheme();
  return (
    <Octicons
      name="bold"
      color={active ? theme.primary : theme.textUnselected}
      size={24}
    />
  );
}
