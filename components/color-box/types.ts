import { ColorValue } from "react-native";
import { SvgProps } from "react-native-svg";

export interface ColorBoxProps {
  onPress: () => void;
  bgColor: ColorValue;
  checked: boolean;
  svgProps?: any;
}
