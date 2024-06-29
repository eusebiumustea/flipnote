import * as React from "react";
import { useTheme } from "../../hooks";
import { moderateScale } from "../../utils";
import Feather from "@expo/vector-icons/Feather";

export function SearchIcon(props: any) {
  const theme = useTheme();

  return (
    <Feather
      {...props}
      name="search"
      size={moderateScale(24)}
      color={theme.onBackgroundSearch}
    />
  );
}
