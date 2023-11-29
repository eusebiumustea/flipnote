import { MotiView } from "moti";
import { PropsWithChildren } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, verticalScale } from "../../tools";
import { BackIcon } from "../assets";
interface ScreenHeaderProps {
  onBack: () => void;
  style?: ViewStyle;
}
export function ScreenHeader({
  children,
  onBack,
  style,
}: PropsWithChildren<ScreenHeaderProps>) {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      style={{
        width: "100%",
        columnGap: 10,
        height: verticalScale(90),
        backgroundColor: theme.background,
        top: 0,
        paddingTop: top + 10,
        ...style,
      }}
    >
      <MotiView
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}

        <View
          style={{
            position: "absolute",
            left: 0,
            padding: 10,
          }}
        >
          <BackIcon onPress={onBack} />
        </View>
      </MotiView>
    </View>
  );
}
