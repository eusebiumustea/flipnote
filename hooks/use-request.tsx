import * as FileSystem from "expo-file-system";
import { note, notesData } from "../screens/note";
import { useRecoilState } from "recoil";
import { NOTES_PATH } from "../constants";

export function useRequest() {
  const [notes, setNotes] = useRecoilState(notesData);

  const request = async () => {
    const { exists } = await FileSystem.getInfoAsync(NOTES_PATH);
    if (!exists) {
      await FileSystem.makeDirectoryAsync(NOTES_PATH).then(() =>
        console.log("init dir")
      );
      return;
    }
    try {
      await FileSystem.readDirectoryAsync(NOTES_PATH).then((files) => {
        console.log(files);
        const tempNotes: note[] = [];
        if (files.length > 0) {
          console.log(files);
          files.forEach(async (file) => {
            await FileSystem.readAsStringAsync(`${NOTES_PATH}/${file}`).then(
              (content) => {
                const note: note = JSON.parse(content);
                tempNotes.push(note);

                if (tempNotes.length === files.length) {
                  console.log(tempNotes);
                  setNotes((prev) => ({ ...prev, data: tempNotes }));
                }
              }
            );
          });
        }
      });
    } catch (e) {}
  };
  return { request };
}
