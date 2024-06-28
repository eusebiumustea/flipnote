import AsyncStorage from "@react-native-async-storage/async-storage";
import { NOTES_PATH } from "../constants";
import { Note } from "../screens";
import * as fs from "expo-file-system";

export async function getShouldRefreshPreviewNotes(): Promise<boolean> {
  const result = await AsyncStorage.getItem("shouldSyncState");
  if (!result) {
    await AsyncStorage.setItem("shouldSyncState", "false");
    return false;
  }
  return JSON.parse(result);
}
export async function setShouldRefreshPreviewNotes(value: boolean) {
  await AsyncStorage.setItem("shouldSyncState", `${value}`);
}
export async function updateNoteStorageValue(
  id: number,
  key: keyof Note,
  value: unknown
) {
  const notePath = `${NOTES_PATH}/${id}`;
  const data = await fs.readAsStringAsync(notePath);
  const parsedData: Note = JSON.parse(data);
  await fs.writeAsStringAsync(
    notePath,
    JSON.stringify({ ...parsedData, [key]: value })
  );
}
