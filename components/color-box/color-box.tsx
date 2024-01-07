import { TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "../../tools";
import { ColorBoxProps } from "./types";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../hooks";

export function ColorBox({
  bgColor,
  checked,
  svgProps,
  onPress,
}: ColorBoxProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: moderateScale(40),
        height: verticalScale(40),
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
      }}
    >
      {checked && (
        <Svg
          fill={"#000"}
          width={"80%"}
          height={"80%"}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          {...svgProps}
        >
          <Path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" />
        </Svg>
      )}
    </TouchableOpacity>
  );
}
