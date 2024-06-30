import { useBackHandler } from "@react-native-community/hooks";
import { addNotificationReceivedListener } from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useRecoilState } from "recoil";
import { useHomeUtils } from "../../hooks/use-home-utils";
import { removeReceivedReminder } from "../inbox/upcoming-reminders";
import { receivedNotifications } from "../note";
import { HomeOverlays } from "./home-overlays";
import { NotesList } from "./notes-list";
export function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [badge, setBadge] = useState(false);
  const [optionsSelection, setOptionsSelection] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorite, setFavorite] = useState(false);
  useBackHandler(() => {
    if (optionsSelection.length > 0) {
      setOptionsSelection([]);
      return true;
    }
    return false;
  });
  const [notifications, setNotifications] = useRecoilState(
    receivedNotifications
  );

  useEffect(() => {
    const listen = addNotificationReceivedListener(async (e) => {
      try {
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
      } catch (error) {}
    });

    return () => listen.remove();
  }, []);
  useEffect(() => {
    if (notifications.length === 0 && badge) {
      setBadge(false);
    }
  }, [notifications]);
  const { data, deleteNotes, searchFilter } = useHomeUtils(
    searchQuery,
    selected,
    favorite,
    optionsSelection,
    setOptionsSelection,
    setFavorite,
    setSelected
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <>
      <NotesList
        searchFilter={searchFilter}
        setSelected={setSelected}
        scrollY={scrollY}
        data={data}
        setFavorite={setFavorite}
        favorite={favorite}
        selected={selected}
        optionsSelection={optionsSelection}
        setOptionsSelection={setOptionsSelection}
      />
      <HomeOverlays
        badge={badge}
        setBadge={setBadge}
        setSearchQuery={setSearchQuery}
        scrollY={scrollY}
        data={data}
        searchQuery={searchQuery}
        optionsSelection={optionsSelection}
        setOptionsSelection={setOptionsSelection}
        onDeleteNotes={deleteNotes}
        searchFilter={searchFilter}
      />
    </>
  );
}
