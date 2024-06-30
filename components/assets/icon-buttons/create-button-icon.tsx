import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import { useTheme } from "../../../hooks";
import { moderateScale } from "../../../utils";
import { IconButtonContainer } from "../../icon-button-container";
import { IconButtonBase } from "./types";

export function CreateIcon({ onPress }: IconButtonBase) {
  const theme = useTheme();

  return (
    <IconButtonContainer
      activeOpacity={1}
      onPress={onPress}
      style={{
        width: moderateScale(61),
        height: moderateScale(61),
        borderRadius: 100,
        backgroundColor: theme.onPrimary,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 30,
        elevation: 10,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
      }}
    >
      <Feather name="plus" size={moderateScale(28)} color={theme.primary} />
    </IconButtonContainer>
  );
}
