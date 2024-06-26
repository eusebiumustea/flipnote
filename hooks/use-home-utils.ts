import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { useRecoilState } from "recoil";
import { useToast } from "../components";
import { NOTES_PATH } from "../constants";
import { notesData } from "../screens";

export function useHomeUtils(
  searchQuery: string,
  selected: string[],
  favorite: boolean,
  optionsSelection: number[],
  setOptionsSelection: Dispatch<SetStateAction<number[]>>,
  setFavorite: Dispatch<SetStateAction<boolean>>,
  setSelected: Dispatch<SetStateAction<string[]>>
) {
  const [notes, setNotes] = useRecoilState(notesData);
  const toast = useToast();
  function deleteNotes() {
    const noteCount = optionsSelection.length;
    const plural = noteCount === 1 ? "" : "s";
    Alert.alert(
      "Confirm Deletion",
      `You're about to permanently delete ${noteCount} note${plural}. This action cannot be undone. Proceed?`,
      [
        { text: "Cancel", style: "cancel", onPress: () => null },
        {
          text: "Delete permanently",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(
                optionsSelection.map(async (id) => {
                  await FileSystem.deleteAsync(`${NOTES_PATH}/${id}`, {
                    idempotent: true,
                  });
                  await Notifications.cancelScheduledNotificationAsync(
                    id.toString()
                  );
                })
              );
              setNotes((prev) => ({
                ...prev,
                data: prev.data.filter((e) => !optionsSelection.includes(e.id)),
              }));
              setOptionsSelection([]);
            } catch (_) {
              toast({ message: "Can't delete notes", textColor: "red" });
            }
          },
        },
      ]
    );
  }

  const searchFilter = useMemo(() => {
    const searchFiltered = notes.data.filter((e) => {
      return (
        e.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (searchQuery.length > 0) {
      return searchFiltered;
    }
    return notes.data;
  }, [notes.data, searchQuery]);
  const selectionFiltered = useMemo(() => {
    const newData = searchFilter.filter((e) => selected.includes(e.title));
    if (selected.length > 0) {
      return newData;
    }
    return searchFilter;
  }, [selected, searchQuery, notes]);
  const data = useMemo(() => {
    if (favorite) {
      return selectionFiltered.filter((e) => e.isFavorite);
    }
    return selectionFiltered;
  }, [selected, searchQuery, notes, favorite]);

  useEffect(() => {
    if (data.filter((e) => e.isFavorite === true).length === 0) {
      setFavorite(false);
    }
    if (
      optionsSelection.length > 0 &&
      favorite &&
      data.filter((e) => e.isFavorite === true).length === 0
    ) {
      setOptionsSelection([]);
    }
    if (data.length === 0) {
      setOptionsSelection([]);
      setSelected([]);
    }
  }, [favorite, data]);
  return { searchFilter, data, deleteNotes };
}
