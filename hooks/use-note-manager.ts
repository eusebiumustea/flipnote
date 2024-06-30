import * as FileSystem from "expo-file-system";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useToast } from "../components";
import { NOTES_PATH } from "../constants";
import { Note } from "../screens";
import { setShouldRefreshPreviewNotes } from "../utils/storage-updater";
import { useRequest } from "./use-request";
export function useNoteStorage(
  id: number,
  editNote: Note,
  setEditNote: Dispatch<SetStateAction<Note>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  noteStateIsEmpty: boolean
) {
  const toast = useToast();
  const notePath = `${NOTES_PATH}/${id}`;
  const [preventDelete, setPreventDelete] = useState(true);
  const { updateNote } = useRequest();
  async function getData() {
    try {
      await setShouldRefreshPreviewNotes(true);
      const { exists } = await FileSystem.getInfoAsync(notePath);
      if (!exists) {
        setPreventDelete(false);
        return;
      }
      const data = await FileSystem.readAsStringAsync(notePath);
      const content: Note = JSON.parse(data);
      setTimeout(() => {
        setEditNote(content);
        setLoading(false);
        setPreventDelete(false);
      }, 300);
    } catch (error) {}
  }
  async function storeDataConditional() {
    try {
      if (!preventDelete && noteStateIsEmpty) {
        await FileSystem.deleteAsync(notePath, { idempotent: true });
      }
      if (!noteStateIsEmpty) {
        await FileSystem.writeAsStringAsync(notePath, JSON.stringify(editNote));
      }
    } catch (e) {
      toast({ message: "Failed to save note", textColor: "red" });
    }
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeDataConditional();
  }, [editNote]);
  useEffect(() => {
    return () => {
      updateNote(id).then(() => setShouldRefreshPreviewNotes(false));
    };
  }, []);
}
