import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useLoading } from "./use-loading-dialog";
import JSZip from "jszip";
import { NOTES_PATH } from "../constants";
import { useRequest } from "./use-request";
import { useToast } from "../components";
import { note } from "../screens";
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
export function useStorageUtils() {
  const loading = useLoading();
  const toast = useToast();
  const { syncState } = useRequest();
  const importNotes = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
        copyToCacheDirectory: false,
      });
      if (result.canceled) {
        return;
      }
      const zipFilePath = result.assets[0].uri;
      const zipFileContents = await FileSystem.readAsStringAsync(zipFilePath, {
        encoding: FileSystem.EncodingType.Base64,
        position: 0,
        length: 115775520,
      });
      const zip = await JSZip.loadAsync(zipFileContents, {
        base64: true,
      });
      const zipItems = Object.keys(zip.files);
      await Promise.all(
        zipItems.map(async (file) => {
          const content = await zip.files[file].async("text");

          if (!validateJSON(content)) {
            toast({ message: "Invalid flipnote backup" });
            return;
          }

          const parsedContent: note = JSON.parse(content);

          const newContent: note = {
            ...parsedContent,
            id: new Date().getTime() / parsedContent.id,
          };
          await FileSystem.writeAsStringAsync(
            `${NOTES_PATH}/${newContent.id}`,
            JSON.stringify(newContent)
          );
        })
      );

      await syncState();
    } catch (error) {
      toast({ message: "Can't import notes", textColor: "red" });
    }
  };
  return { importNotes };
}
