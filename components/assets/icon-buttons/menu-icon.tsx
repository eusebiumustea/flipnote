import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function MenuIcon({ onPress, btnProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25) }}
      {...btnProps}
    >
      <Feather name="menu" size={moderateScale(24)} color={theme.onPrimary} />
    </IconButtonContainer>
  );
}
