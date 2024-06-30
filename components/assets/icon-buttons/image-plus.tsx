import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function ImagePlusIcon({ onPress, btnProps }: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer
      onPress={onPress}
      style={{ width: moderateScale(28), height: verticalScale(28) }}
      {...btnProps}
    >
      <MaterialCommunityIcons
        name="image-plus"
        size={moderateScale(26)}
        color={theme.primary}
      />
    </IconButtonContainer>
  );
}
