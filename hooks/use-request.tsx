import * as fs from "expo-file-system";
import { useRecoilState } from "recoil";
import { NOTES_PATH, NOTES_PREVIEW_PATH } from "../constants";
import { Note, NotePreviewTypes, notesData } from "../screens";
import { removeElementAtId, replaceElementAtId } from "../utils";
export function useRequest() {
  const [notes, setNotes] = useRecoilState(notesData);

  const updateNote = async (id: number) => {
    try {
      const fileInfo = await fs.getInfoAsync(`${NOTES_PATH}/${id}`);
      if (!fileInfo.exists) {
        setNotes((prev) => ({
          ...prev,
          data: removeElementAtId(prev.data, id),
        }));
        return;
      }
      const content = await fs.readAsStringAsync(`${NOTES_PATH}/${id}`);
      const newNote: Note = JSON.parse(content);
      setNotes((prev) => ({
        ...prev,
        data: replaceElementAtId(prev.data, id, {
          id: newNote.id,
          title: newNote.title.substring(0, 110),
          text: newNote.text.substring(0, 170),
          background: newNote.background,
          isFavorite: newNote.isFavorite,
          reminder: newNote.reminder,
          imageOpacity: newNote.imageOpacity,
          contentPosition: newNote.contentPosition,
        }),
      }));
    } catch (error) {}
  };

  const syncState = async () => {
    try {
      const notesDir = await fs.getInfoAsync(NOTES_PATH);

      if (!notesDir.exists) {
        setNotes((prev) => ({ ...prev, data, loading: false }));
        await fs.makeDirectoryAsync(NOTES_PATH);
        return;
      }

      const files = await fs.readDirectoryAsync(NOTES_PATH);

      const promisesDataFiles = files.map(async (file) => {
        const content = await fs.readAsStringAsync(`${NOTES_PATH}/${file}`);
        const newNote: Note = JSON.parse(content);

        return {
          id: newNote.id,
          title: newNote.title.substring(0, 110),
          text: newNote.text.substring(0, 170),
          background: newNote.background,
          isFavorite: newNote.isFavorite,
          reminder: newNote.reminder,
          imageOpacity: newNote.imageOpacity,
          contentPosition: newNote.contentPosition,
        } as NotePreviewTypes;
      });
      const data = await Promise.all(promisesDataFiles);
      setNotes((prev) => ({ ...prev, data, loading: false, loaded: true }));
    } catch (error) {}
  };
  const loadPreviewNotes = async () => {
    try {
      const previewNotes = await fs.getInfoAsync(NOTES_PREVIEW_PATH);
      const notesDir = await fs.getInfoAsync(NOTES_PATH);
      if (!notesDir.exists) {
        await fs.makeDirectoryAsync(NOTES_PATH);
      }
      if (!previewNotes.exists) {
        setNotes((prev) => ({ ...prev, loading: false, loaded: true }));
        return;
      }

      const data = await fs.readAsStringAsync(NOTES_PREVIEW_PATH);

      const parsedData = JSON.parse(data);
      setNotes((prev) => ({ ...prev, data: parsedData, loading: false }));
      setNotes((prev) => ({ ...prev, loaded: true }));
    } catch (error) {}
  };
  const updateListOfNotes = async (files: number[]) => {
    try {
      if (files.length === 0) {
        return;
      }
      const promisesNewDataFiles = files.map(async (file) => {
        const content = await fs.readAsStringAsync(`${NOTES_PATH}/${file}`);
        const newNote: Note = JSON.parse(content);
        return {
          id: newNote.id,
          title: newNote.title.substring(0, 110),
          text: newNote.text.substring(0, 170),
          background: newNote.background,
          isFavorite: newNote.isFavorite,
          reminder: newNote.reminder,
          imageOpacity: newNote.imageOpacity,
          contentPosition: newNote.contentPosition,
        } as NotePreviewTypes;
      });
      const newData = await Promise.all(promisesNewDataFiles);
      setNotes((prev) => ({ ...prev, data: [...newData, ...prev.data] }));
    } catch (error) {}
  };
  return { syncState, updateNote, updateListOfNotes, loadPreviewNotes };
}
