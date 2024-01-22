import { Dispatch, SetStateAction, useEffect } from "react";
import { useToast } from "../components";
import { note } from "../screens";
import * as FileSystem from "expo-file-system";
import { NOTES_PATH } from "../constants";
import { useRequest } from "./use-request";
export function useNoteStorage(
  id: number,
  editNote: note,
  setEditNote: Dispatch<SetStateAction<note>>
) {
  const toast = useToast();
  const { request } = useRequest();
  const fileName = `${id}.json`;
  const notePath = `${NOTES_PATH}/${fileName}`;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  useEffect(() => {
    async function getData() {
      FileSystem.readAsStringAsync(notePath)
        .then((data) => {
          const content: note = JSON.parse(data);
          setTimeout(() => setEditNote(content), 300);
        })
        .catch(() => null);
    }
    getData();
  }, []);
  useEffect(() => {
    async function storeDataConditional() {
      try {
        if (noteStateIsEmpty) {
          await FileSystem.deleteAsync(notePath, { idempotent: true });
        } else {
          await FileSystem.writeAsStringAsync(
            notePath,
            JSON.stringify(editNote)
          );
          console.log("edited");
        }
      } catch (_) {
        toast({ message: "Failed to save note", textColor: "red" });
      }
    }
    storeDataConditional();
  }, [editNote]);
  useEffect(() => {
    return () => {
      request();
    };
  }, []);
}
