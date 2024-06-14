import { PropsWithChildren, useEffect } from "react";
import { useRequest } from "../hooks/use-request";
import { useRecoilValue } from "recoil";
import { notesData } from "./atom";
import * as fs from "expo-file-system";
import { NOTES_PREVIEW_PATH } from "../constants";
export function AppStorageContext({ children }: PropsWithChildren) {
  const notes = useRecoilValue(notesData);
  async function updatePreviewNotesStorage() {
    try {
      await fs.writeAsStringAsync(
        NOTES_PREVIEW_PATH,
        JSON.stringify(notes.data)
      );
    } catch (error) {}
  }
  const { loadPreviewNotes } = useRequest();
  useEffect(() => {
    loadPreviewNotes();
  }, []);
  useEffect(() => {
    if (notes.loaded) {
      updatePreviewNotesStorage();
    }
  }, [notes]);
  return children;
}
