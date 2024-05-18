import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components";
import { useTheme } from "../../hooks";
import { deleteAsync } from "expo-file-system";
export function ImagePreview({ route }) {
  const { uri }: { uri: string } = route.params;
  const nav = useNavigation<StackNavigationHelpers>();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: theme.background,
      }}
    >
      <View
        style={{
          padding: 16,

          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button
          onPress={async () => {
            try {
              nav.goBack();
              await deleteAsync(uri, { idempotent: true });
            } catch (error) {}
          }}
        >
          Cencel
        </Button>
        <Button
          onPress={async () => {
            await Sharing.shareAsync(uri);

            await deleteAsync(uri, { idempotent: true });
            nav.goBack();
          }}
        >
          Share
        </Button>
      </View>

      <Image
        source={{ uri }}
        contentFit="contain"
        transition={{ duration: 300, effect: "cross-dissolve" }}
        style={{
          width: width - 32,
          height: height - 86 - top,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
