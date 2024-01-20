import * as FileSystem from "expo-file-system";
import { note, notesData } from "../screens/note";
import { useRecoilState } from "recoil";
import { NOTES_PATH } from "../constants";

export function useRequest() {
  const [notes, setNotes] = useRecoilState(notesData);

  const request = async () => {
    try {
      const { exists } = await FileSystem.getInfoAsync(NOTES_PATH);
      if (!exists) {
        await FileSystem.makeDirectoryAsync(NOTES_PATH).then(() =>
          console.log("init dir")
        );
        return;
      }
      const files = await FileSystem.readDirectoryAsync(NOTES_PATH);
      console.log(files);

      if (files.length === 0) {
        setNotes((prev) => ({ ...prev, data: [] }));
        return;
      }
      const promisesFiles = files.map(async (file) => {
        const content = await FileSystem.readAsStringAsync(
          `${NOTES_PATH}/${file}`
        );
        const note: note = JSON.parse(content);

        return note;
      });
      console.log(files);
      const notes = await Promise.all(promisesFiles);
      setNotes((prev) => ({ ...prev, data: notes }));
    } catch (e) {}
  };
  const readNotes = async () => {
    try {
      const { exists } = await FileSystem.getInfoAsync(NOTES_PATH);
      if (!exists) {
        return;
      }
      const files = await FileSystem.readDirectoryAsync(NOTES_PATH);
      return files;
    } catch (e) {}
  };
  return { request, readNotes };
}
