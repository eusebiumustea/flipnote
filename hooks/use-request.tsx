import * as FileSystem from "expo-file-system";
import { BackgroundImages, note, notesData } from "../screens/note";
import { useRecoilState } from "recoil";
import { NOTES_PATH, imagesDir } from "../constants";

export function useRequest() {
  const [notes, setNotes] = useRecoilState(notesData);
  const [backgroundImages, setBackgroundImages] =
    useRecoilState(BackgroundImages);
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

      if (files.length === 0) {
        setNotes((prev) => ({ ...prev, data: [] }));
        return;
      }
      const promisesDataFiles = files.map(async (file) => {
        const content = await FileSystem.readAsStringAsync(
          `${NOTES_PATH}/${file}`
        );
        const note: note = JSON.parse(content);

        return note;
      });

      const notes = await Promise.all(promisesDataFiles);
      setNotes((prev) => ({ ...prev, data: notes }));
      const images = await FileSystem.readDirectoryAsync(imagesDir);
      const promisesImageFiles = images.map(async (image) => {
        return `${imagesDir}/${image}`;
      });
      const imageSources = await Promise.all(promisesImageFiles);
      setBackgroundImages(imageSources);
    } catch (e) {}
  };

  return { request };
}
