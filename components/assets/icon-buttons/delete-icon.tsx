import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function DeleteIcon({
  svgProps,
  onPress,
  style,
  btnProps,
  color,
}: IconButtonBase) {
  const theme = useTheme();

  return (
    <IconButtonContainer
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        width: moderateScale(30),
        height: verticalScale(30),
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      {...btnProps}
    >
      <Feather
        name="trash-2"
        size={moderateScale(24)}
        color={color || theme.onPrimary}
        {...svgProps}
      />
    </IconButtonContainer>
  );
}
