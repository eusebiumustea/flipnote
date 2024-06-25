import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../../components";
import { darkCardColors } from "../../../constants";
import { activityIndicatorColors } from "../../home/notes-list";
export function LoadingItem({ bg }: { bg: string }) {
  const { top } = useSafeAreaInsets();
  const nav = useNavigation<StackNavigationHelpers>();
  const defaultThemeColor = darkCardColors.includes(bg) ? "#ffffff" : "#000000";
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        paddingTop: top,
      }}
    >
      <BackIcon
        onPress={() => nav.goBack()}
        color={defaultThemeColor}
        style={{
          position: "absolute",
          top,
          left: 0,
          marginTop: 8,
          marginBottom: 8,
          marginHorizontal: 8,
        }}
      />

      <ActivityIndicator size={"large"} />
    </View>
  );
}
