import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../../hooks";
import { moderateScale, verticalScale } from "../../../utils";
import { IconButtonBase } from "./types";
import Feather from "@expo/vector-icons/Feather";
import { IconButtonContainer } from "../../icon-button-container";

export function ClipboardIcon({
  svgProps,
  onPress,
  btnProps,
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
      <Feather
        name="clipboard"
        size={24}
        color={!color ? theme.onBackground : color}
        {...svgProps}
      />
    </IconButtonContainer>
  );
}
