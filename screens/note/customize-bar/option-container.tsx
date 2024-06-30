import { PropsWithChildren, ReactNode } from "react";
import { ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "../../../hooks";

type OptionContainerProps = {
  children: PropsWithChildren<ReactNode>;
  show: boolean;
  style?: ViewStyle;
};
export function OptionContainer({
  show,
  children,
  style,
}: OptionContainerProps) {
  const theme = useTheme();
  if (show)
    return (
      <Animated.View
        entering={FadeIn.duration(300).delay(120)}
        style={{
          backgroundColor: theme.customizeBarColor,
          position: "absolute",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          top: 0,
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          ...style,
        }}
      >
        {children}
      </Animated.View>
    );
}
