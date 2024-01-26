import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { verticalScale } from "../../tools";

export function Screen1({ navigation }) {
  const { top } = useSafeAreaInsets();
  const data = [
    { id: 1, text: "hello1" },
    { id: 2, text: "hello2" },
    { id: 3, text: "hello3" },
    { id: 4, text: "hello4" },
    { id: 5, text: "hello5" },
  ];
  const { width, height } = useWindowDimensions();
  return (
    <View style={{ flex: 1, top }}>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-evenly", gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Animated.View
            sharedTransitionTag={index.toString()}
            style={{
              width: width / 2 - 16,
              height: verticalScale(250),
              borderRadius: 16,
              backgroundColor: "yellow",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("screen2", {
                  text: item.text,
                  index: index.toString(),
                })
              }
              style={{
                backgroundColor: "yellow",
                alignSelf: "center",
                width: "100%",
                height: "100%",
                borderRadius: 16,
              }}
            />
            <Text>{item.text}</Text>
          </Animated.View>
        )}
      />
    </View>
  );
}
export function Screen2({ navigation, route }) {
  const { top } = useSafeAreaInsets();
  const { text, index } = route.params;
  return (
    <View style={{ flex: 1, top }}>
      <Text>{text}</Text>
      <Animated.View
        sharedTransitionTag={"0"}
        style={{
          width: "100%",
          height: "100%",

          backgroundColor: "red",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 50, height: 50, backgroundColor: "green" }}
        />
      </Animated.View>
    </View>
  );
}
