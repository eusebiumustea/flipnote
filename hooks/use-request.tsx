import * as FileSystem from "expo-file-system";
import { useRecoilState } from "recoil";
import { NOTES_PATH, imagesData } from "../constants";
import {
  BackgroundImages,
  NotePreviewTypes,
  note,
  notesData,
} from "../screens";
type RequestTypes = {
  path: string;
  contents?: boolean;
};
export function useRequest() {
  const [notes, setNotes] = useRecoilState(notesData);
  const [img, setImg] = useRecoilState(BackgroundImages);
  // const request = async ({ path, contents = true }: RequestTypes) => {
  //   try {
  //     const { exists, isDirectory } = await FileSystem.getInfoAsync(path);
  //     if (!exists) {
  //       return [];
  //     }
  //     if (isDirectory) {
  //       const files = await FileSystem.readDirectoryAsync(path);
  //       if (files.length === 0) {
  //         return [];
  //       }
  //       if (!contents) {
  //         return files;
  //       }
  //       const promisesDataFiles = files.map(async (file) => {
  //         const { isDirectory } = await FileSystem.getInfoAsync(
  //           `${path}/${file}`
  //         );
  //         if (isDirectory) {
  //           return;
  //         }
  //         const content = await FileSystem.readAsStringAsync(`${path}/${file}`);
  //         return JSON.parse(content);
  //       });

  //       const data = await Promise.all(promisesDataFiles);
  //       return data;
  //     }
  //     const content = await FileSystem.readAsStringAsync(path);
  //     return JSON.parse(content);
  //   } catch (e) {}
  // };
  const syncState = async () => {
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
      } as NotePreviewTypes;
    });
    const data = await Promise.all(promisesDataFiles);
    setNotes(data);
  };
  const syncImagesState = async () => {
    const imgInfo = await FileSystem.getInfoAsync(imagesData);
    if (!imgInfo.exists) {
      return;
    }
    const data = await FileSystem.readAsStringAsync(imagesData);
    const images: string[] = JSON.parse(data);
    await Promise.all(
      images.map((uri) => {
        FileSystem.getInfoAsync(uri).then(({ exists }) => {
          if (exists && !img.includes(uri)) {
            setImg((prev) => [...prev, uri]);
          }
        });
      })
    );

    await FileSystem.writeAsStringAsync(imagesData, JSON.stringify(img));
  };
  return { syncState, syncImagesState };
}
