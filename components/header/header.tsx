import * as Notifications from "expo-notifications";
import React, { PropsWithChildren, memo, useEffect, useState } from "react";
import { Animated, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";

import { receivedNotifications } from "../../contexts/atom";
import { useTheme } from "../../hooks";
import { useRequest } from "../../hooks/use-request";
import { useStorageRequest } from "../../hooks/use-storage-request";
import { removeReceivedReminder } from "../../screens/inbox/upcoming-reminders";
import { moderateFontScale, moderateScale, verticalScale } from "../../utils";
import { ImportIcon, InboxIcon, SearchIcon } from "../assets";
import { HeaderProps } from "./types";
export const Header = memo(
  ({
    searchValue,
    onSearch,
    scrollY,
    children,
    extraHeight = 0,
    onInboxOpen,
  }: PropsWithChildren<HeaderProps>) => {
    const theme = useTheme();
    const { top } = useSafeAreaInsets();
    const [badge, setBadge] = useState(false);

    const [notifications, setNotifications] = useRecoilState(
      receivedNotifications
    );

    useEffect(() => {
      const listen = Notifications.addNotificationReceivedListener(
        async (e) => {
          try {
          } catch (error) {}
          setNotifications((data) => [
            ...data,
            {
              content: e.request.content.body,
              time: new Date(e.date),
              title: e.request.content.title,
            },
          ]);
          if (!badge) {
            setBadge(true);
            setTimeout(() => setBadge(false), 120000);
          }

          await removeReceivedReminder(+e.request.identifier);
          await syncState();
        }
      );

      return () => {
        listen.remove();
      };
    }, []);
    useEffect(() => {
      if (notifications.length === 0 && badge) {
        setBadge(false);
      }
    }, [notifications]);
    const { syncState } = useRequest();
    const { importNotes } = useStorageRequest();
    return (
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          flexDirection: "column",
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
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              paddingHorizontal: moderateScale(10),
              left: 12,
            }}
          >
            <SearchIcon />
          </View>
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <InboxIcon
              onPress={(e) => {
                if (badge) {
                  setBadge(false);
                }
                onInboxOpen(e);
              }}
              active={badge}
            />
            <ImportIcon onPress={importNotes} />
          </View>
        </View>
        {children}
      </Animated.View>
    );
  }
);
