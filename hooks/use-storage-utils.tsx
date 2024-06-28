import * as DocumentPicker from "expo-document-picker";
import * as fs from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { useToast } from "../components";
import { NOTES_PATH } from "../constants";
import { Note, NotePreviewTypes } from "../screens";
import { useLoading } from "./use-loading-dialog";
import { useRequest } from "./use-request";
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
  const toast = useToast();
  const { updateListOfNotes } = useRequest();
  const setLoading = useLoading();
  async function Share(
    shareNotes: NotePreviewTypes[],
    fileName: string = "flipnotebackup",
    password: string | null = null
  ) {
    try {
      setLoading(true);
      const output = `${fs.cacheDirectory}${fileName}.zip`;
      const zip = new JSZip();
      await Promise.all(
        shareNotes.map(async (note) => {
          const noteStorageContent = await fs.readAsStringAsync(
            `${NOTES_PATH}/${note.id}`
          );
          const parsedNote: Note = JSON.parse(noteStorageContent);
          if (parsedNote.background.includes("/")) {
            zip.file(
              `${note.id}`,
              JSON.stringify({
                ...parsedNote,
                background: "#fff",
                imageData: "",
                imageOpacity: 0,
              })
            );
            return;
          }
          zip.file(`${note.id}`, noteStorageContent);
        })
      );

      const zipContent = await zip.generateAsync({
        type: "base64",
        compression: "STORE",
      });

      await fs.writeAsStringAsync(output, zipContent, {
        encoding: fs.EncodingType.Base64,
      });

      await Sharing.shareAsync(output, {
        mimeType: "application/zip",
      });
      await fs.deleteAsync(output, { idempotent: true });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  async function Save(
    shareNotes: NotePreviewTypes[],
    fileName: string = "flipnotebackup",
    password: string | null = null
  ) {
    try {
      setLoading(true);
      const zip = new JSZip();
      await Promise.all(
        shareNotes.map(async (note) => {
          const noteStorageContent = await fs.readAsStringAsync(
            `${NOTES_PATH}/${note.id}`
          );
          const parsedNote: Note = JSON.parse(noteStorageContent);
          if (parsedNote.background.includes("/")) {
            zip.file(
              `${note.id}`,
              JSON.stringify({
                ...parsedNote,
                background: "#fff",
                imageData: "",
                imageOpacity: 0,
              })
            );
            return;
          }
          zip.file(`${note.id}`, noteStorageContent);
        })
      );

      const zipContent = await zip.generateAsync({
        type: "base64",
        compression: "STORE",
      });

      const permission =
        await fs.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permission.granted) {
        const newUri = await fs.StorageAccessFramework.createFileAsync(
          permission.directoryUri,
          `${fileName}.zip`,
          "application/zip"
        );
        await fs.writeAsStringAsync(newUri, zipContent, {
          encoding: "base64",
        });
        toast({ message: "Archive successfully saved" });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
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
      setLoading("Preparing package");
      const zipFileContents = await fs.readAsStringAsync(zipFilePath, {
        encoding: fs.EncodingType.Base64,
      });

      const zip = await JSZip.loadAsync(zipFileContents, {
        base64: true,
      });

      const zipItems = Object.keys(zip.files);
      const content = await zip.files[zipItems[0]].async("text");
      if (!validateJSON(content)) {
        toast({ message: "Invalid flipnote backup" });
        setLoading(false);
        return;
      }
      const importedNotes = await Promise.all(
        zipItems.map(async (file, i) => {
          const content = await zip.files[file].async("text");

          const parsedContent: Note = JSON.parse(content);

          const newContent: Note = {
            ...parsedContent,
            id: new Date().getTime() / parsedContent.id,
          };
          await fs.writeAsStringAsync(
            `${NOTES_PATH}/${newContent.id}`,
            JSON.stringify(newContent)
          );
          return newContent.id;
        })
      );

      await updateListOfNotes(importedNotes);
    } catch (error) {
      toast({ message: "Error: corrupted archive", textColor: "red" });
    } finally {
      setLoading(false);
    }
  };
  return { importNotes, Share, Save };
}
