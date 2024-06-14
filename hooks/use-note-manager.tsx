import * as FileSystem from "expo-file-system";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useToast } from "../components";
import { NOTES_PATH } from "../constants";
import { Note } from "../screens";
import { useRequest } from "./use-request";
export function useNoteStorage(
  id: number,
  editNote: Note,
  setEditNote: Dispatch<SetStateAction<Note>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  const toast = useToast();
  const notePath = `${NOTES_PATH}/${id}`;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const [preventDelete, setPreventDelete] = useState(true);
  const { updateNote } = useRequest();
  useEffect(() => {
    async function getData() {
      try {
        const { exists } = await FileSystem.getInfoAsync(notePath);

        if (!exists) {
          setPreventDelete(false);
          setLoading(false);
          return;
        }
        const data = await FileSystem.readAsStringAsync(notePath);
        const content: Note = JSON.parse(data);
        setTimeout(() => {
          setEditNote(content);
          setLoading(false);
          setPreventDelete(false);
        }, 200);
      } catch (error) {}
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
      } catch (e) {
        toast({ message: "Failed to save note", textColor: "red" });
      }
    }
    storeDataConditional();
  }, [preventDelete, editNote]);
  useEffect(() => {
    return () => {
      updateNote(id);
    };
  }, []);
}
