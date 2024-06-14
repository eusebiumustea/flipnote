import { View } from "react-native";
import { LoadingCard } from "../../../components/loading-card";
import { useTheme } from "../../../hooks";

export function RenderLoading() {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "column",
        gap: 12,
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      {new Array(3).fill(null).map((_, i) => (
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}
          key={i}
        >
          <LoadingCard />
          <LoadingCard />
        </View>
      ))}
    </View>
  );
}
