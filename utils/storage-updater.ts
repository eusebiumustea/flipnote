import { NOTES_PATH } from "../constants";
import { Note } from "../screens";
import * as fs from "expo-file-system";
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
