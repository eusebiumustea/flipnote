import React, { memo, useEffect, useRef } from "react";
import { Animated, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InboxIcon, MenuIcon, SearchIcon } from "../../../../components/assets";
import { useTheme } from "../../../../hooks";
import {
  moderateFontScale,
  moderateScale,
  verticalScale,
} from "../../../../utils";
import { HeaderProps } from "./types";
export const Header = memo(
  ({
    searchValue,
    onSearch,
    scrollY,
    onInboxOpen,
    onShowOptions,
    setBadge,
    badge,
  }: HeaderProps) => {
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, []);
    const theme = useTheme();
    const { top } = useSafeAreaInsets();

    return (
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          flexDirection: "column",
          height: verticalScale(70) + top,
          backgroundColor: theme.background,
          top: 0,
          paddingTop: top,
          opacity,
          transform: [
            {
              translateY: Animated.diffClamp(scrollY, 0, 160).interpolate({
                inputRange: [0, 160],
                outputRange: [0, -160],
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
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <SearchIcon
            style={{ position: "absolute", zIndex: 1, marginHorizontal: 26 }}
          />

          <TextInput
            value={searchValue}
            style={{
              width: "80%",
              height: verticalScale(50),
              backgroundColor: theme.backgroundSearch,
              justifyContent: "flex-start",
              fontSize: moderateFontScale(14),
              borderRadius: moderateScale(15),
              color: theme.onBackgroundSearch,
              paddingHorizontal: moderateScale(50),
              fontFamily: "OpenSans",
            }}
            placeholder="Search for notes"
            onChangeText={onSearch}
            placeholderTextColor={theme.onBackgroundSearch}
            keyboardType="default"
            textContentType="none"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",

              gap: moderateScale(8),
            }}
          >
            <InboxIcon
              onPress={() => {
                if (badge) {
                  setBadge(false);
                }
                onInboxOpen();
              }}
              active={badge}
            />
            <MenuIcon onPress={onShowOptions} />
          </View>
        </View>
      </Animated.View>
    );
  }
);
