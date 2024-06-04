import * as FileSystem from "expo-file-system";
import { useRecoilState } from "recoil";
import { NOTES_PATH } from "../constants";
import { NotePreviewTypes, note, notesData } from "../screens";
export function useRequest() {
  const [notes, setNotes] = useRecoilState(notesData);

  const syncState = async () => {
    const { exists } = await FileSystem.getInfoAsync(NOTES_PATH);
    if (!exists) {
      await FileSystem.makeDirectoryAsync(NOTES_PATH);
      return;
    }
    const files = await FileSystem.readDirectoryAsync(NOTES_PATH);

    if (files.length === 0) {
      setNotes([]);
    }
    const promisesDataFiles = files.map(async (file) => {
      const content = await FileSystem.readAsStringAsync(
        `${NOTES_PATH}/${file}`
      );
      const newNote: note = JSON.parse(content);
      return {
        id: newNote.id,
        title: newNote.title.substring(0, 150),
        text: newNote.text.substring(0, 240),
        background: newNote.background,
        isFavorite: newNote.isFavorite,
        reminder: newNote.reminder,
        imageOpacity: newNote.imageOpacity,
      } as NotePreviewTypes;
    });
    const data = await Promise.all(promisesDataFiles);
    setNotes(data);
  };
  return { syncState };
}
