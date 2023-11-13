import {
  Animated,
  Dimensions,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  moderateFontScale,
  moderateScale,
  useTheme,
  verticalScale,
} from "../../tools";
import { InboxIcon, SearchIcon } from "../assets";
import { HeaderProps } from "./types";
import { PropsWithChildren } from "react";
export function Header({
  searchValue,
  onSearch,
  scrollY,
  children,
  extraHeight = 0,
}: PropsWithChildren<HeaderProps>) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <Animated.View
      style={{
        position: "absolute",
        width: "100%",
        zIndex: 999,
        height: verticalScale(70) + top + extraHeight,
        backgroundColor: theme.background,
        top: 0,
        paddingTop: top,
        transform: [
          {
            translateY: Animated.diffClamp(
              scrollY,
              0,
              verticalScale(130)
            ).interpolate({
              inputRange: [0, verticalScale(130)],
              outputRange: [0, verticalScale(-130)],
              extrapolate: "clamp",
            }),
          },
        ],
      }}
    >
      <View
        style={{
          width: "100%",
          height: verticalScale(70),
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 30,
          alignSelf: "center",
          gap: moderateScale(7),
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
              fontFamily: "google-sans",
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
      </View>

      {children}
    </Animated.View>
  );
}
