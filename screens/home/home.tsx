import { useBackHandler } from "@react-native-community/hooks";
import React, { useState } from "react";
import { useAnimatedValue } from "react-native";
import { useRecoilState } from "recoil";
import { useHomeUtils } from "../../hooks/use-home-utils";
import { currentElementCoordinates } from "../note";
import { HomeOverlays } from "./home-overlays";
import { NotesList } from "./notes-list";

export function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [optionsSelection, setOptionsSelection] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [elementPosition, setElementPosition] = useRecoilState(
    currentElementCoordinates
  );

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
  const scrollY = useAnimatedValue(0);
  return (
    <>
      <NotesList
        setElementPosition={setElementPosition}
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
        setElementPosition={setElementPosition}
        selected={selected}
        searchFilter={searchFilter}
      />
    </>
  );
}
