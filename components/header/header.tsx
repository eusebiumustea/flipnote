import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { HeaderProps } from "./types";
import {
  moderateFontScale,
  moderateScale,
  useTheme,
  verticalScale,
} from "../../tools";
import { InboxIcon, SearchIcon } from "../assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export function Header({ searchValue, onSearch, scrollY }: HeaderProps) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <Animated.View
      style={{
        width: "100%",
        justifyContent: "center",
        position: "absolute",
        backgroundColor: theme.background,
        zIndex: 2,
        alignItems: "center",
        flexDirection: "row",
        height: verticalScale(60),
        paddingHorizontal: moderateScale(30),

        top: top,
        transform: [
          {
            translateY: Animated.diffClamp(
              scrollY,
              0,
              verticalScale(60 + top)
            ).interpolate({
              inputRange: [0, verticalScale(60 + top)],
              outputRange: [0, verticalScale(-60 - top)],
              extrapolate: "clamp",
            }),
          },
        ],
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          alignSelf: "center",
          height: "100%",
        }}
      >
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            paddingHorizontal: moderateScale(10),
          }}
        >
          <SearchIcon />
        </View>

        <TextInput
          style={{
            width: "95%",
            height: verticalScale(50),
            backgroundColor: theme.backgroundSearch,
            justifyContent: "flex-start",
            fontSize: moderateFontScale(15),
            borderRadius: moderateScale(15),
            color: theme.onBackgroundSearch,
            paddingLeft: moderateScale(40),
          }}
          placeholder="Search for notes"
          onChangeText={onSearch}
          placeholderTextColor={theme.onBackgroundSearch}
          keyboardType="default"
          textContentType="none"
          onSelectionChange={(e) => console.log(e.nativeEvent.selection)}
        >
          {searchValue.split("").map((e, i) => (
            <Text key={i}>{e}</Text>
          ))}
        </TextInput>
      </View>
      <TouchableOpacity
        style={{
          width: moderateScale(24),
          height: verticalScale(24),
        }}
      >
        <InboxIcon badge={true} />
      </TouchableOpacity>
    </Animated.View>
  );
}
