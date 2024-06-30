import { MotiView } from "moti";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
} from "react-native";
import { Text } from "react-native-fast-text";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { moderateFontScale, verticalScale } from "../../utils";
interface ButtonProps extends PressableProps {
  children: ReactNode;
  loading?: boolean;
  colors?: null | {
    focusedColor: string;
    color: string;
    textColorFocused: string;
    textColor: string;
  };
}
export function Button({
  loading,
  colors,
  children,
  ...pressableProps
}: ButtonProps) {
  const theme = useTheme();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const focusedBg = colors ? colors.focusedColor : theme.onPrimary;
  const bg = colors ? colors.color : theme.primary;
  const focusedTextColor = colors ? colors.textColorFocused : theme.primary;
  const textColor = colors ? colors.textColor : theme.onPrimary;
  return (
    <AnimatedPressable {...pressableProps} disabled={loading}>
      {({ pressed }) => {
        return (
          <MotiView
            transition={{
              type: "timing",
              duration: 100,
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: verticalScale(8),
              elevation: Platform.OS === "android" && 10,
              shadowColor: theme.onBackground,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
            from={{
              backgroundColor: theme.primary,

              scale: 1,
            }}
            animate={{
              backgroundColor: pressed ? focusedBg : bg,
              scale: pressed ? 0.9 : 1,
            }}
          >
            {loading && <ActivityIndicator size="small" color={"green"} />}

            <Text
              style={{
                color: pressed ? focusedTextColor : textColor,
                fontSize: moderateFontScale(13),
              }}
            >
              {children}
            </Text>
          </MotiView>
        );
      }}
    </AnimatedPressable>
  );
}
