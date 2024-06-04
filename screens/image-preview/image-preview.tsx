import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { deleteAsync } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components";
import { useTheme } from "../../hooks";
import { useCallback } from "react";
export function ImagePreview({ route }) {
  const { uri }: { uri: string } = route.params;
  const nav = useNavigation<StackNavigationHelpers>();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  useFocusEffect(
    useCallback(() => {
      return () => deleteAsync(uri, { idempotent: true }).catch((e) => {});
    }, [])
  );
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
          zIndex: 1,
        }}
      >
        <Button onPress={() => nav.goBack()}>Cencel</Button>
        <Button
          onPress={async () => {
            await Sharing.shareAsync(uri);
            nav.goBack();
          }}
        >
          Share
        </Button>
      </View>

      <ImageZoom
        uri={uri}
        maxScale={10}
        minScale={0.6}
        resizeMode="contain"
        width={width - 32}
        height={height - 86 - top}
        style={{
          flex: 0,
        }}
      />
    </View>
  );
}
