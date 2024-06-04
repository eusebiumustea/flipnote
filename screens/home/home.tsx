import { useBackHandler } from "@react-native-community/hooks";
import React, { useRef, useState } from "react";
import { Animated } from "react-native";
import { useHomeUtils } from "../../hooks/use-home-utils";
import { HomeOverlays } from "./home-overlays";
import { NotesList } from "./notes-list";
export function Home() {
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
