import * as fs from "expo-file-system";
import { useRecoilState, useRecoilValue } from "recoil";
import { NOTES_PATH } from "../constants";
import {
  Note,
  NotePreviewTypes,
  notesData,
  notesIdentifiers,
} from "../screens";
import { removeElementAtId, replaceElementAtId } from "../utils";
export function useRequest() {
  const [notes, setNotes] = useRecoilState(notesData);
  const identifiers = useRecoilValue(notesIdentifiers);

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
      const { exists } = await fs.getInfoAsync(NOTES_PATH);
      if (!exists) {
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
      setNotes((prev) => ({ ...prev, data, loading: false }));
    } catch (error) {}
  };
  const refreshState = async () => {
    try {
      const files = await fs.readDirectoryAsync(NOTES_PATH);

      if (files.length !== identifiers.length) {
        const newFiles = files.filter((e) => !identifiers.includes(e));

        const promisesDataFiles = newFiles.map(async (file, i) => {
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

        setNotes((prev) => ({ ...prev, data: [...prev.data, ...data] }));
      }
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
  return { syncState, updateNote, updateListOfNotes };
}
