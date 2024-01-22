import { useRecoilState } from "recoil";
import * as FileSystem from "expo-file-system";
import { note, notesData } from "../screens";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { removeArrayKeyDuplicates } from "../tools";
import { useToast } from "../components";
import { Alert } from "react-native";
import { NOTES_PATH } from "../constants";
import * as Notifications from "expo-notifications";
import { useRequest } from "./use-request";

export function useHomeUtils(
  searchQuery: string,
  selected: string[],
  favorite: boolean,
  optionsSelection: number[],
  setOptionsSelection: Dispatch<SetStateAction<number[]>>,
  setFavorite: Dispatch<SetStateAction<boolean>>,
  setSelected: Dispatch<SetStateAction<string[]>>
) {
  const [notes] = useRecoilState(notesData);
  const toast = useToast();
  const { request } = useRequest();
  function deleteNotes() {
    const noteCount = optionsSelection.length;
    const plural = noteCount === 1 ? "" : "s";
    Alert.alert(
      "Confirm Deletion",
      `You're about to permanently delete ${noteCount} note${plural} and cencel their reminders. This action cannot be undone. Proceed?`,
      [
        { text: "Cencel", style: "cancel", onPress: () => null },
        {
          text: "Delete permanently",
          style: "destructive",
          onPress: () => {
            try {
              FileSystem.readDirectoryAsync(NOTES_PATH)
                .then((files) => {
                  Promise.all(
                    files.map(async (file) => {
                      const content = await FileSystem.readAsStringAsync(
                        `${NOTES_PATH}/${file}`
                      );
                      const data: note = JSON.parse(content);
                      if (optionsSelection.includes(data.id)) {
                        await FileSystem.deleteAsync(`${NOTES_PATH}/${file}`, {
                          idempotent: true,
                        });
                        await Notifications.cancelScheduledNotificationAsync(
                          data.id.toString()
                        );
                      }
                    })
                  );
                  request();
                  console.log("re");
                  setOptionsSelection([]);
                })
                .catch((e) => console.log(e));
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
        e.text.includes(searchQuery.toLowerCase()) ||
        e.title.includes(searchQuery.toLowerCase()) ||
        (e.title.includes(searchQuery.toLowerCase()) &&
          e.text.includes(searchQuery.toLowerCase()))
      );
    });
    if (searchQuery) {
      return searchFiltered;
    }
    return notes.data;
  }, [searchQuery, notes.data]);
  const selectionFiltered = useMemo(() => {
    const newData = searchFilter.filter((e) => selected.includes(e.title));
    if (selected.length > 0) {
      return newData;
    }
    return searchFilter;
  }, [selected, searchQuery, notes.data]);
  const data = useMemo(() => {
    if (favorite) {
      return selectionFiltered.filter((e) => e.isFavorite);
    }
    return selectionFiltered;
  }, [selected, searchQuery, notes.data, favorite]);

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
