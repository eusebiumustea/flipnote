import { useBackHandler } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useHomeUtils } from "../../hooks/use-home-utils";
import { HomeOverlays } from "./home-overlays";
import { NotesList } from "./notes-list";
export function Home() {
  const focused = useIsFocused();
  const [selected, setSelected] = useState<string[]>([]);
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
  useEffect(() => {
    if (focused) {
      scrollY.setValue(0);
    }
  }, [focused]);

  return (
    <>
      <NotesList
        scrollY={scrollY}
        data={data}
        optionsSelection={optionsSelection}
        setOptionsSelection={setOptionsSelection}
      />
      <HomeOverlays
        setSearchQuery={setSearchQuery}
        setSelected={setSelected}
        scrollY={scrollY}
        data={data}
        searchQuery={searchQuery}
        setOptionsSelection={setOptionsSelection}
        optionsSelection={optionsSelection}
        onDeleteNotes={deleteNotes}
        setFavorite={setFavorite}
        favorite={favorite}
        selected={selected}
        searchFilter={searchFilter}
      />
    </>
  );
}
