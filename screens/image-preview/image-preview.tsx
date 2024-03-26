import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { deleteAsync } from "expo-file-system";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { useEffect } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, useToast } from "../../components";
import { useTheme } from "../../hooks";
export function ImagePreview({ route }) {
  const { uri }: { uri: string } = route.params;
  const nav = useNavigation<StackNavigationHelpers>();
  const toast = useToast();
  useEffect(() => {
    if (uri === "not_found") {
      nav.goBack();
      toast({ message: "Image not captured", textColor: "red" });
    }
  }, []);
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

      <Image
        source={{ uri }}
        contentFit="contain"
        transition={{ duration: 300, effect: "cross-dissolve" }}
        style={{
          width: width - 32,
          height: height - 86 - top,
        }}
      />
    </View>
  );
}
