import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function HeartIcon({
  svgProps,
  onPress,
  btnProps,
  focused,
  color,
}: IconButtonBase) {
  const theme = useTheme();
  return (
    <IconButtonContainer
      onPress={onPress}
      style={{
        width: moderateScale(30),
        height: verticalScale(30),
        justifyContent: "center",
        alignItems: "center",
      }}
      {...btnProps}
    >
      {!focused && (
        <Feather
          name="heart"
          size={moderateScale(24)}
          color={!color ? theme.onBackground : color}
          {...svgProps}
        />
      )}
      {focused && <FontAwesome name="heart" size={24} color="red" />}
    </IconButtonContainer>
  );
}
