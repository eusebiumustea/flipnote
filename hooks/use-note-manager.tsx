import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  const notePath = `${NOTES_PATH}/${id}`;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const [preventDelete, setPreventDelete] = useState(true);
  useEffect(() => {
    async function getData() {
      try {
        const { exists } = await FileSystem.getInfoAsync(notePath);
        if (!exists) {
          setPreventDelete(false);
          return;
        }
        const data = await FileSystem.readAsStringAsync(notePath);
        const content: note = JSON.parse(data);
        setTimeout(() => {
          setEditNote(content);
          setPreventDelete(false);
        }, 300);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);
  useEffect(() => {
    async function storeDataConditional() {
      try {
        if (!preventDelete && noteStateIsEmpty) {
          await FileSystem.deleteAsync(notePath, { idempotent: true });
        }
        if (!noteStateIsEmpty) {
          await FileSystem.writeAsStringAsync(
            notePath,
            JSON.stringify(editNote)
          );
        }
      } catch (_) {
        toast({ message: "Failed to save note", textColor: "red" });
      }
    }
    storeDataConditional();
  }, [preventDelete, editNote]);
  useEffect(() => {
    return () => {
      request();
    };
  }, []);
}
