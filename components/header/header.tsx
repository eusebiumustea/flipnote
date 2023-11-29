import * as Notifications from "expo-notifications";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Animated, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  moderateFontScale,
  moderateScale,
  useTheme,
  verticalScale,
} from "../../tools";
import { InboxIcon, SearchIcon } from "../assets";
import { HeaderProps } from "./types";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
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
          <MotiPressable
            transition={{
              type: "timing",
              duration: 350,
              opacity: { duration: 200 },
              scale: { duration: 300 },
            }}
            from={{
              scale: 1,
              translateX: moderateScale(-50),
              translateY: verticalScale(50),
              opacity: 1,
            }}
            animate={{
              scale: inboxOpened ? 3 : 1,
              translateX: inboxOpened ? moderateScale(-50) : 0,
              translateY: inboxOpened ? verticalScale(50) : 0,
              opacity: inboxOpened ? 0 : 1,
            }}
            onPress={onInboxOpen}
            style={{
              width: moderateScale(28),
              height: verticalScale(28),
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
