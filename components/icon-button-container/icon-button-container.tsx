import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { moderateScale, verticalScale } from "../../utils";

export function IconButtonContainer({
  children,
  ...rest
}: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        width: moderateScale(28),
        height: verticalScale(28),
        alignItems: "center",
        justifyContent: "center",
      }}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}
