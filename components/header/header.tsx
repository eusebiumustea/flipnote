import * as Notifications from "expo-notifications";
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import {
  Animated,
  Pressable,
  TextInput,
  View,
  useAnimatedValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  moderateFontScale,
  moderateScale,
  recalculateId,
  verticalScale,
} from "../../tools";
import { ImportIcon, InboxIcon, SearchIcon } from "../assets";
import { HeaderProps } from "./types";
import { useTheme } from "../../hooks";
import { useRecoilState } from "recoil";
import { notesData, receivedNotifications } from "../../screens";
import JSZip from "jszip";
export const Header = React.memo(
  ({
    searchValue,
    onSearch,
    scrollY,
    children,
    extraHeight = 0,
    onInboxOpen,
    show,
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
        setNotifications((prev) => ({
          data: [
            ...prev.data,
            {
              id: Number(e.request.identifier),
              content: e.request.content.body,
              time: new Date(e.date),
              title: e.request.content.title,
            },
          ],
        }));
        setBadge(true);
        setTimeout(() => setBadge(false), 120000);
      });
      return () => {
        listen.remove();
      };
    }, []);
    if (show) {
      return (
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 3,
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <ImportIcon
                onPress={async () => {
                  await DocumentPicker.getDocumentAsync({
                    type: "application/zip",
                  })
                    .then(async (result) => {
                      if (result.canceled) {
                        return;
                      }

                      const zipFilePath = result.assets[0].uri;

                      const zipFileContents =
                        await FileSystem.readAsStringAsync(zipFilePath, {
                          encoding: FileSystem.EncodingType.Base64,
                        });
                      const zip = await JSZip.loadAsync(zipFileContents, {
                        base64: true,
                      });

                      const dirParent = `${FileSystem.cacheDirectory}flipnote`;
                      await FileSystem.makeDirectoryAsync(dirParent, {
                        intermediates: true,
                      });

                      const zipItems = Object.keys(zip.files);
                      zipItems.forEach(async (file) => {
                        const content = await zip.files[file].async("text");
                        await FileSystem.writeAsStringAsync(
                          `${dirParent}/${file}`,
                          content
                        )
                          .then(() => {
                            console.log("file created", `${dirParent}/${file}`);
                            const styleSeparatorIndex =
                              content.lastIndexOf("&");
                            const text = content.slice(0, styleSeparatorIndex);
                            const styles = JSON.parse(
                              content.slice(styleSeparatorIndex + 1)
                            );
                            setNotes((prev) => ({
                              ...prev,
                              data: [
                                ...prev.data,
                                {
                                  id: prev.data.length + 1,
                                  title: "",
                                  text,
                                  isFavorite: false,
                                  background: "#fff",
                                  styles,
                                  reminder: null,
                                },
                              ],
                            }));
                          })

                          .catch((e) => console.error(e));
                      });
                    })
                    .catch((e) => console.error(e));
                }}
              />
              <InboxIcon onPress={onInboxOpen} active={badge} />
            </View>
          </View>
          {children}
        </Animated.View>
      );
    }
  }
);
