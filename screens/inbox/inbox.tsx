import { BlurView } from "expo-blur";
import * as Notifications from "expo-notifications";
import { AnimatePresence, MotiView } from "moti";
import React, { Fragment, useMemo } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { ScreenHeader, Swipe } from "../../components";
import {
  animationConfig,
  dateTime,
  deviceIsLowRam,
  moderateFontScale,
  moderateScale,
  replaceElementAtId,
  useTheme,
  verticalScale,
} from "../../tools";
import { notesData } from "../note";
interface InboxProps {
  onBack: () => void;
  open: boolean;
}
export function Inbox({ onBack, open }: InboxProps) {
  const [notes, setNotes] = useRecoilState(notesData);
  const upcomingNotifications = useMemo(() => {
    return notes.data.filter(
      (e) => e.reminder && new Date() < new Date(e.reminder)
    );
  }, [notes.data]);
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const config =
    Platform.OS === "ios" &&
    Swipe({
      onMove(e, state) {},
      onRelease: (e, state) => {
        const x = state.dx;
        const pageX = e.nativeEvent.pageX;
        if (x > 0 && pageX < 200) {
          onBack();
        }
      },
    });

  return (
    <AnimatePresence>
      {open && (
        <Modal onRequestClose={onBack} transparent>
          {!deviceIsLowRam && (
            <MotiView
              transition={{
                type: "timing",
                duration: 350,
              }}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                zIndex: -2,
                position: "absolute",
              }}
            >
              <BlurView tint="dark" style={{ flex: 1 }} />
            </MotiView>
          )}
          {deviceIsLowRam && (
            <MotiView
              transition={{
                type: "timing",
                duration: 200,
              }}
              from={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                height: "100%",
                zIndex: -2,
                position: "absolute",
                backgroundColor: "#000",
              }}
            />
          )}
          <MotiView
            {...config}
            transition={animationConfig}
            style={{
              backgroundColor: theme.background,
              flex: 1,
            }}
            from={{
              translateX: width / 2 - moderateScale(30),
              translateY: -height / 2 + top + 30,

              scale: 0,
            }}
            animate={{
              translateX: 0,
              translateY: 0,

              scale: 1,
            }}
            exit={{
              translateX: width / 2 - moderateScale(30),
              translateY: -height / 2 + top + 30,

              scale: 0,
            }}
          >
            <ScreenHeader
              style={{ paddingVertical: 10 }}
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
              onBack={onBack}
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
              {upcomingNotifications.length === 0 && (
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
                    <View
                      style={{
                        width: "100%",
                        borderRadius: 16,
                        backgroundColor: note.background,
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
                    </View>
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
            </ScrollView>
          </MotiView>
        </Modal>
      )}
    </AnimatePresence>
  );
}
