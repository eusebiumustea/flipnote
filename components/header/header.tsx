import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
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
  const { width } = Dimensions.get("window");
  return (
    <Animated.View
      style={{
        width: "100%",
        justifyContent: "center",
        backgroundColor: theme.background,
        gap: moderateScale(8),
        zIndex: 3,
        alignItems: "center",
        flexDirection: "row",
        height: verticalScale(60),
        paddingHorizontal: moderateScale(30),
        top,
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
          value={searchValue}
          style={{
            width: "100%",
            height: verticalScale(50),
            backgroundColor: theme.backgroundSearch,
            justifyContent: "flex-start",
            fontSize: moderateFontScale(14),
            borderRadius: moderateScale(15),
            color: theme.onBackgroundSearch,
            paddingHorizontal: moderateScale(40),
          }}
          placeholder="Search for notes"
          onChangeText={onSearch}
          placeholderTextColor={theme.onBackgroundSearch}
          keyboardType="default"
          textContentType="none"
        />
      </View>
      <TouchableOpacity
        style={{
          width: moderateScale(28),
          height: verticalScale(28),
        }}
      >
        <InboxIcon badge={false} />
      </TouchableOpacity>
    </Animated.View>
  );
}
