import { MotiText, MotiView } from "moti";
import { Platform, Pressable, PressableProps } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { ReactNode } from "react";

interface ButtonProps extends PressableProps {
  children?: ReactNode;
  colors?: null | {
    focusedColor: string;
    color: string;
    textColorFocused: string;
    textColor: string;
  };
}
export function Button({ colors, children, ...pressableProps }: ButtonProps) {
  const theme = useTheme();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const focusedBg = colors ? colors.focusedColor : theme.onPrimary;
  const bg = colors ? colors.color : theme.primary;
  const focusedTextColor = colors ? colors.textColorFocused : theme.primary;
  const textColor = colors ? colors.textColor : theme.onPrimary;
  return (
    <AnimatedPressable {...pressableProps}>
      {({ pressed }) => {
        return (
          <MotiView
            transition={{ type: "timing", borderRadius: { duration: 100 } }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              elevation: Platform.OS === "android" && 10,
              shadowColor: theme.onBackground,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,

              shadowRadius: 10,
            }}
            from={{ backgroundColor: bg, borderRadius: 16 }}
            animate={{
              backgroundColor: pressed ? focusedBg : bg,
              borderRadius: pressed ? 6 : 24,
            }}
          >
            <MotiText
              transition={{ type: "timing", duration: 80 }}
              from={{ color: theme.background } as unknown}
              animate={
                {
                  color: pressed ? focusedTextColor : textColor,
                } as unknown
              }
            >
              {children}
            </MotiText>
          </MotiView>
        );
      }}
    </AnimatedPressable>
  );
}
