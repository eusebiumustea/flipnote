import * as React from "react";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale, verticalScale } from "../../../tools";
import { IconButtonBase } from "./types";

export function ImagePlusIcon({ svgProps, onPress, btnProps }: IconButtonBase) {
  return (
    <Pressable
      {...btnProps}
      onPress={onPress}
      style={{ width: moderateScale(25), height: verticalScale(25) }}
    >
      <Svg width={"100%"} height={"100%"} viewBox="0 0 24 24" {...svgProps}>
        <Path d="M18 15v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2m-4.7 6H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8.3c-.6-.2-1.3-.3-2-.3-1.1 0-2.2.3-3.1.9L14.5 12 11 16.5l-2.5-3L5 18h8.1c-.1.3-.1.7-.1 1 0 .7.1 1.4.3 2z" />
      </Svg>
    </Pressable>
  );
}
