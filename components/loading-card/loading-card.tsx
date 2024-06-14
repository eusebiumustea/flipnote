import { View, useColorScheme, useWindowDimensions } from "react-native";
import { shadows } from "../../ui-config";
import { verticalScale } from "../../utils";
import { useTheme } from "../../hooks";
import { Skeleton } from "moti/skeleton";

export function LoadingCard() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        height: verticalScale(250),
        width: width / 2 - 16,
        borderRadius: 16,
        padding: 16,
        gap: 12,
        justifyContent: "center",
        ...shadows(theme),
        backgroundColor: theme.primary,
      }}
    >
      <Skeleton height={10} width={"70%"} colorMode={colorScheme} />
      <Skeleton height={10} width={"80%"} colorMode={colorScheme} />
      <Skeleton height={10} width={"90%"} colorMode={colorScheme} />
      {new Array(4).fill(null).map((_, i) => (
        <Skeleton key={i} height={10} width={"100%"} colorMode={colorScheme} />
      ))}
    </View>
  );
}
