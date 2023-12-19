import * as Notifications from "expo-notifications";
import {
  MotiPressable,
  MotiPressableProps,
  MotiPressableTransitionProp,
} from "moti/interactions";
import React, { PropsWithChildren, useEffect, useState } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  animationConfig,
  deviceIsLowRam,
  moderateFontScale,
  moderateScale,
  useTheme,
  verticalScale,
} from "../../tools";
import { InboxIcon, SearchIcon } from "../assets";
import { HeaderProps } from "./types";
import { Animated, TextInput, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { MotiAnimationProp, MotiFromProp, MotiProps } from "moti";
export const Header = React.memo(
  ({
    searchValue,
    onSearch,
    scrollY,
    children,
    extraHeight = 0,
    onInboxOpen,
    inboxOpened,
  }: PropsWithChildren<HeaderProps>) => {
    const theme = useTheme();
    const { top } = useSafeAreaInsets();
    const [badge, setBadge] = useState(false);
    useEffect(() => {
      const listen = Notifications.addNotificationReceivedListener(() => {
        setBadge(true);
        setTimeout(() => setBadge(false), 10000);
      });

      return () => {
        listen.remove();
        console.log("removed");
      };
    }, []);
    const motiConfig: MotiPressableProps = !deviceIsLowRam && {
      from: {
        scale: 1,
        opacity: 1,
        translateX: moderateScale(-50),
        translateY: 50,
      },
      animate: {
        scale: inboxOpened ? 2 : 1,
        opacity: inboxOpened ? 0 : 1,
        translateX: inboxOpened ? moderateScale(-50) : 0,
        translateY: inboxOpened ? 50 : 0,
      },
    };

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

          <MotiPressable
            transition={animationConfig}
            {...motiConfig}
            onPress={onInboxOpen}
            style={{
              width: moderateScale(30),
              height: verticalScale(30),
            }}
          >
            <InboxIcon badge={badge} />
          </MotiPressable>
        </View>

        {children}
      </Animated.View>
    );
  }
);
