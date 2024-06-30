import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../../components";
import { darkCardColors } from "../../../constants";
import { memo } from "react";
import { verticalScale } from "../../../utils";
import { NoteScreenHeader } from "../note-screen-header";
export const LoadingItem = memo(({ bg }: { bg: string }) => {
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
      }}
    >
      <View
        style={{
          width: "100%",
          paddingTop: verticalScale(6) + top,
          paddingHorizontal: 8,
          position: "absolute",
          top: 0,
        }}
      >
        <BackIcon color={defaultThemeColor} onPress={() => nav.goBack()} />
      </View>
      <ActivityIndicator size={"large"} />
    </View>
  );
});
