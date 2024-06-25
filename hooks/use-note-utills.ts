import * as fs from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import * as Print from "expo-print";
import * as Share from "expo-sharing";
import { Dispatch, SetStateAction } from "react";
import { Keyboard, Platform } from "react-native";
import ViewShot from "react-native-view-shot";
import { useToast } from "../components";
import { Note } from "../screens";
import { dateTime } from "../utils";
import { useLoading } from "./use-loading-dialog";
import { useHTMLRenderedContent } from "./use-note-content";
export function useNoteUtils(
  id: number,
  editNote: Note,
  setEditNote: Dispatch<SetStateAction<Note>>,
  setReminderDialog: Dispatch<SetStateAction<boolean>>,
  setShowTitle: Dispatch<SetStateAction<boolean>>,
  setCapturing: Dispatch<SetStateAction<boolean>>,
  viewShotRef: React.MutableRefObject<ViewShot>,
  noteStateIsEmpty: boolean
) {
  const toast = useToast();
  const setLoading = useLoading();

  const scheduleDateForNotification =
    editNote.reminder && new Date(editNote.reminder);
  const html = useHTMLRenderedContent(
    editNote.text,
    editNote.title,
    editNote.background,
    editNote.imageOpacity,
    editNote.imageData
  );
  async function SharePDF() {
    try {
      setLoading("Preparing PDF...");
      const result = await Print.printToFileAsync({
        width: 794,
        height: 1102,
        html,
        useMarkupFormatter: !isImgBg,
      });

      await Share.shareAsync(result.uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
      await fs.deleteAsync(result.uri, { idempotent: true });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  async function SavePDF() {
    try {
      const permission =
        await fs.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permission.granted) {
        const result = await Print.printToFileAsync({
          width: 794,
          height: 1102,
          html,
          useMarkupFormatter: !isImgBg,
          base64: true,
        });
        const newUri = await fs.StorageAccessFramework.createFileAsync(
          permission.directoryUri,
          `Flipnote-${id}.pdf`,
          "application/pdf"
        );
        await fs.writeAsStringAsync(newUri, result.base64, {
          encoding: "base64",
        });
        await fs.deleteAsync(result.uri, { idempotent: true });
        toast({ message: "Pdf successfully saved" });
      }
    } catch (error) {
      toast({ message: "Failed to save pdf" });
    }
  }
  async function ShareImage() {
    try {
      setLoading("Preparing image...");
      setCapturing(true);
      if (editNote.title.length === 0) {
        setShowTitle(false);
      }
      const image = await viewShotRef.current.capture();
      await Share.shareAsync(image);
    } catch (error) {
    } finally {
      setCapturing(false);
      setShowTitle(true);
      setLoading(false);
    }
  }
  async function SaveImage() {
    try {
      setLoading("Preparing image...");
      setCapturing(true);
      if (editNote.title.length === 0) {
        setShowTitle(false);
      }

      const image = await viewShotRef.current.capture();

      if (editNote.title.length === 0) {
        setShowTitle(true);
      }
      setCapturing(false);

      await MediaLibrary.saveToLibraryAsync(image);
      toast({ message: "Image saved to library" });
    } catch (error) {
      toast({ message: "Failed to save image", textColor: "red" });
    } finally {
      setLoading(false);
    }
  }
  const isImgBg = editNote.background.includes("/");
  function openReminder() {
    if (noteStateIsEmpty) {
      toast({
        message: "Write something to schedule reminder",
      });
      return;
    }
    if (scheduleDateForNotification > new Date()) {
      toast({
        button: {
          title: "Cencel",
          onPress: async () => {
            await Notifications.cancelScheduledNotificationAsync(id.toString());
            setEditNote((prev) => ({ ...prev, reminder: null }));
            toast({ message: "Cenceled" });
          },
        },
        message: `Reminder already set for ${dateTime(
          scheduleDateForNotification
        )}`,
      });
      return;
    }
    if (scheduleDateForNotification <= new Date()) {
      setEditNote((prev) => ({ ...prev, reminder: null }));
      setReminderDialog(true);
      return;
    }
    setReminderDialog(true);
  }

  return {
    openReminder,
    SaveImage,
    SavePDF,
    ShareImage,
    SharePDF,
  };
}
