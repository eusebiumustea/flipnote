import { PropsWithChildren, useEffect } from "react";
import { useRequest } from "../hooks/use-request";
import { useRecoilValue } from "recoil";
import { notesData } from "./atom";
import * as fs from "expo-file-system";
import { NOTES_PREVIEW_PATH } from "../constants";
import {
  getShouldRefreshPreviewNotes,
  setShouldRefreshPreviewNotes,
} from "../utils/storage-updater";
export function AppStorageContext({ children }: PropsWithChildren) {
  const notes = useRecoilValue(notesData);
  const { loadPreviewNotes, syncState } = useRequest();
  async function updatePreviewNotesStorage() {
    try {
      await fs.writeAsStringAsync(
        NOTES_PREVIEW_PATH,
        JSON.stringify(notes.data)
      );
    } catch (error) {}
  }

  async function loadNotes() {
    const shouldRefreshPreviewNotes = await getShouldRefreshPreviewNotes();
    if (shouldRefreshPreviewNotes) {
      await syncState();
      await setShouldRefreshPreviewNotes(false);
    } else {
      await loadPreviewNotes();
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);
  useEffect(() => {
    if (notes.loaded) {
      updatePreviewNotesStorage();
    }
  }, [notes]);
  return children;
}
