import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { ActivityIndicator, View } from "react-native";
import { Text } from "react-native-fast-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../../components";
import { useTheme } from "../../../hooks";
export function LoadingItem() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const nav = useNavigation<StackNavigationHelpers>();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        paddingTop: top,
      }}
    >
      <BackIcon
        onPress={() => nav.goBack()}
        color={"#000"}
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
      <Text style={{ color: "#000", fontSize: 16, top: 6 }}>Loading...</Text>
    </View>
  );
}
