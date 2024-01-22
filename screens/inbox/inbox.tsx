import * as Notifications from "expo-notifications";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { ScreenHeader } from "../../components/screen-header";
import { useTheme } from "../../hooks";
import {
  dateTime,
  moderateFontScale,
  removeElementAtIndex,
  replaceElementAtId,
  verticalScale,
} from "../../tools";
import { notesData, receivedNotifications } from "../note";
import { CloseIcon } from "../../components";
import Animated, { FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";

export const Inbox = ({ navigation }) => {
  const [notes, setNotes] = useRecoilState(notesData);
  const [received, setReceived] = useRecoilState(receivedNotifications);
  const upcomingNotifications = useMemo(() => {
    return notes.data.filter(
      (e) => e.reminder && new Date() < new Date(e.reminder)
    );
  }, [notes.data]);
  const theme = useTheme();

  // const gestureConfig =
  //   Platform.OS === "ios" &&
  //   Swipe({
  //     onMove(e, state) {},
  //     onRelease: (e, state) => {
  //       const x = state.dx;
  //       const pageX = e.nativeEvent.pageX;
  //       if (x > 0 && pageX < 200) {
  //         navigation.goBack();
  //       }
  //     },
  //   });
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        style={{ paddingTop: top + 8 }}
        children={
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.onPrimary,
                fontWeight: "bold",
                fontSize: moderateFontScale(20),
              }}
            >
              Notifications
            </Text>
          </View>
        }
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: verticalScale(10),
          rowGap: 8,
          paddingBottom: 30,
        }}
        style={{
          backgroundColor: theme.background,
          flex: 1,
        }}
      >
        {upcomingNotifications.length === 0 && received.length === 0 && (
          <>
            <Text
              style={{
                color: theme.onPrimary,
                fontSize: moderateFontScale(17),
                textAlign: "center",
                fontFamily: "OpenSans",
                paddingTop: 16,
              }}
            >
              No upcoming notifications
            </Text>
          </>
        )}
        {upcomingNotifications.length > 0 && (
          <Text
            style={{
              color: theme.onPrimary,
              fontSize: moderateFontScale(18),
            }}
          >
            Upcoming
          </Text>
        )}
        {upcomingNotifications.map((note, i) => {
          const reminder = new Date(note.reminder);

          return (
            <Fragment key={i}>
              <Pressable
                style={{
                  width: "100%",
                  borderRadius: 16,
                  backgroundColor: note.background.includes("/")
                    ? theme.primary
                    : note.background,
                  padding: 16,
                  flexDirection: "column",
                  elevation: 5,
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.17,
                  shadowRadius: 3.05,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: moderateFontScale(18),
                    color: "#000",
                  }}
                >
                  {note.title.length > 0 ? note.title : note.text}
                </Text>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    await Notifications.cancelScheduledNotificationAsync(
                      note.id.toString()
                    );
                    setNotes((prev) => ({
                      ...prev,
                      data: replaceElementAtId(prev.data, note.id, {
                        ...note,
                        reminder: null,
                      }),
                    }));
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      fontSize: moderateFontScale(16),
                      fontFamily: "OpenSans",
                      fontWeight: "bold",
                    }}
                  >
                    Cencel
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: theme.onPrimary,

                    fontSize: moderateFontScale(15),
                  }}
                >
                  {dateTime(reminder)}
                </Text>
              </View>
            </Fragment>
          );
        })}
        {received.length > 0 && (
          <Text
            style={{
              color: theme.onPrimary,
              fontSize: moderateFontScale(20),
              paddingTop: 16,
            }}
          >
            Received notifications
          </Text>
        )}
        {received.map((item, i) => {
          return (
            <Fragment key={i}>
              <Pressable
                style={{
                  width: "100%",
                  borderRadius: 16,
                  backgroundColor: theme.onPrimary,
                  padding: 16,
                  flexDirection: "column",
                  elevation: 5,
                  shadowColor: theme.primary,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.17,
                  shadowRadius: 3.05,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: moderateFontScale(18),
                    color: theme.primary,
                  }}
                >
                  {item?.title?.length >= 100
                    ? `${item?.title?.slice(0, 100)}...`
                    : item?.title}
                </Text>
                <Text
                  style={{
                    fontSize: moderateFontScale(14),
                    color: theme.primary,
                    paddingVertical: 6,
                  }}
                >
                  {item?.content?.length >= 100
                    ? `${item?.content?.slice(0, 100)}...`
                    : item?.content}
                </Text>
                <CloseIcon
                  onPress={() =>
                    setReceived((prev) => prev.filter((e) => e !== item))
                  }
                  style={{
                    position: "absolute",
                    right: 0,
                    alignSelf: "center",
                    margin: 12,
                  }}
                  svgProps={{ fill: theme.primary }}
                />
              </Pressable>

              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: theme.onPrimary,

                    fontSize: moderateFontScale(15),
                  }}
                >
                  {dateTime(item.time)}
                </Text>
              </View> */}
            </Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};
