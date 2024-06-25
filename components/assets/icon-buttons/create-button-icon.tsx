import * as React from "react";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../hooks";
import { moderateScale } from "../../../utils";
import { IconButtonBase } from "./types";

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
      <Svg
        {...svgProps}
        width={45}
        height={45}
        viewBox="0 0 39 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M9.795 19.5h19.41M19.5 29.205V9.795"
          stroke={theme.primary}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}
