import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useLoading } from "./use-loading-dialog";
import JSZip from "jszip";
import { NOTES_PATH } from "../constants";
import { useRequest } from "./use-request";
import { useToast } from "../components";
function validateJSON(jsonText: string): boolean {
  try {
    if (
      !jsonText.startsWith("{") &&
      !jsonText.endsWith("}") &&
      !jsonText.includes("title") &&
      !jsonText.includes("text") &&
      !jsonText.includes("isFavorite") &&
      !jsonText.includes("background") &&
      !jsonText.includes("styles") &&
      !jsonText.includes("reminder") &&
      !jsonText.includes("contentPosition") &&
      !jsonText.includes("imageOpacity")
    ) {
      return false;
    }
    JSON.parse(jsonText);
  } catch (_) {
    return false;
  }
  return true;
}
export function useStorageRequest() {
  const loading = useLoading();
  const toast = useToast();
  const { syncState } = useRequest();
  const importNotes = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
      });
      if (result.canceled) {
        return;
      }
      const zipFilePath = result.assets[0].uri;
      loading(true);
      const zipFileContents = await FileSystem.readAsStringAsync(zipFilePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const zip = await JSZip.loadAsync(zipFileContents, {
        base64: true,
      });
      const zipItems = Object.keys(zip.files);
      loading(true);
      await Promise.all(
        zipItems.map(async (file) => {
          const { exists } = await FileSystem.getInfoAsync(
            `${NOTES_PATH}/${file}`
          );
          if (exists) {
            loading(false);
            return;
          }
          const content = await zip.files[file].async("text");

          if (!validateJSON(content)) {
            loading(false);
            toast({ message: "Invalid flipnote backup" });
            return;
          }
          await FileSystem.writeAsStringAsync(`${NOTES_PATH}/${file}`, content);
        })
      );
      await syncState();
      loading(false);
    } catch (error) {
      loading(false);
    }
  };
  return { importNotes };
}
