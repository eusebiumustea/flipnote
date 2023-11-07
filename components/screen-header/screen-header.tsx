import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../tools";
import { BackIcon } from "../assets";
interface ScreenHeaderProps {
  children?: ReactNode;
}
export function ScreenHeader({ children }: ScreenHeaderProps) {
  const nav = useNavigation<NavigationProp<any>>();
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      style={{
        width: "100%",
        columnGap: 10,
        paddingTop: top,
        backgroundColor: theme.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          columnGap: 16,
          padding: 10,
        }}
      >
        <BackIcon onPress={() => nav.goBack()} />
        {children}
      </View>
    </View>
  );
}
