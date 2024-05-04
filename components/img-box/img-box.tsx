import { ImageBackground, TouchableOpacity, View } from "react-native";
import { moderateScale, verticalScale } from "../../utils";
import Svg, { Path } from "react-native-svg";
import { ImgBoxProps } from "./types";

export function ImageBox({
  checked,
  onPress,
  uri,
  svgProps,
  onLongPress,
}: ImgBoxProps) {
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      style={{
        width: moderateScale(40),
        height: verticalScale(40),
        borderRadius: 6,
      }}
    >
      <ImageBackground
        borderRadius={6}
        source={{ uri }}
        style={{
          width: "100%",
          height: "100%",

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {checked && (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              position: "absolute",
              opacity: 0.4,
              borderRadius: 6,
            }}
          />
        )}
        {checked && (
          <Svg
            style={{ zIndex: 2 }}
            fill={"#fff"}
            width={"80%"}
            height={"80%"}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            {...svgProps}
          >
            <Path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" />
          </Svg>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}
