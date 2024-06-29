import * as React from "react";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale } from "../../../utils";
import { IconButtonBase } from "./types";
import Feather from "@expo/vector-icons/Feather";

export function CreateIcon({ svgProps, onPress }: IconButtonBase) {
  const theme = useTheme();

  return (
    <Pressable
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
      <Feather name="plus" size={28} color={theme.primary} />
    </Pressable>
  );
}
