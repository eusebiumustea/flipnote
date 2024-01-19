import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import JSZip from "jszip";
import React, { PropsWithChildren, memo, useEffect, useState } from "react";
import { Animated, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";

import { notesData, receivedNotifications } from "../../contexts/atom";
import { useTheme } from "../../hooks";
import { useRequest } from "../../hooks/use-request";
import { note } from "../../screens";
import { moderateFontScale, moderateScale, verticalScale } from "../../tools";
import { ImportIcon, InboxIcon, SearchIcon } from "../assets";
import { HeaderProps } from "./types";
import { NOTES_PATH } from "../../constants";
import { useLoading } from "../../hooks/use-loading-dialog";
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
    const [notes, setNotes] = useRecoilState(notesData);

    const [notifications, setNotifications] = useRecoilState(
      receivedNotifications
    );
    useEffect(() => {
      const listen = Notifications.addNotificationReceivedListener((e) => {
        setNotifications((data) => [
          ...data,
          {
            content: e.request.content.body,
            time: new Date(e.date),
            title: e.request.content.title,
          },
        ]);
        setBadge(true);
        setTimeout(() => setBadge(false), 120000);
      });
      return () => {
        listen.remove();
      };
    }, []);
    const loading = useLoading();
    useEffect(() => {
      if (notifications.length === 0) {
        setBadge(false);
      }
    }, [notifications]);
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
            <ImportIcon
              onPress={async () => {
                await DocumentPicker.getDocumentAsync({})
                  .then(async (result) => {
                    if (result.canceled) {
                      return;
                    }

                    const zipFilePath = result.assets[0].uri;

                    const zipFileContents = await FileSystem.readAsStringAsync(
                      zipFilePath,
                      {
                        encoding: FileSystem.EncodingType.Base64,
                      }
                    );
                    const zip = await JSZip.loadAsync(zipFileContents, {
                      base64: true,
                    });

                    // const dirParent = `${FileSystem.cacheDirectory}flipnote`;
                    // await FileSystem.makeDirectoryAsync(dirParent, {
                    //   intermediates: true,
                    // });

                    const zipItems = Object.keys(zip.files);
                    const tempData: note[] = [];
                    loading(true);
                    zipItems.map(async (file, i, arr) => {
                      const content = await zip.files[file].async("text");
                      await FileSystem.writeAsStringAsync(
                        `${NOTES_PATH}/${file}`,
                        content
                      )
                        .then(() => {
                          const newNote: note = JSON.parse(content);
                          tempData.push(newNote);
                          if (tempData.length === arr.length) {
                            setNotes((prev) => ({
                              ...prev,
                              data: [...prev.data, ...tempData],
                            }));
                          }
                        })
                        .catch((e) => {
                          console.error(e);
                        });
                    });
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }}
            />
            <InboxIcon onPress={onInboxOpen} active={badge} />
          </View>
        </View>
        {children}
      </Animated.View>
    );
  }
);
