import * as fs from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import * as Print from "expo-print";
import * as Share from "expo-sharing";
import { Dispatch, SetStateAction } from "react";
import ViewShot from "react-native-view-shot";
import { useToast } from "../components";
import { contentLengthLimit } from "../constants";
import { Note } from "../screens";
import { dateTime } from "../utils";
import { useHTMLRenderedContent } from "./use-note-content";
import { useLoading } from "./use-loading-dialog";
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
  const loading = useLoading();
  const scheduleDateForNotification =
    editNote.reminder && new Date(editNote.reminder);
  const html = useHTMLRenderedContent(
    editNote.text,
    editNote.title,
    editNote.background,
    editNote.imageOpacity,
    editNote.imageData
  );
  async function SharePDF(cancel: () => void) {
    loading("Preparing doc file...");
    Print.printToFileAsync({
      width: 794,
      height: 1102,
      html,

      useMarkupFormatter: false,
    })
      .then((result) => {
        Share.shareAsync(result.uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
        })
          .then(() =>
            fs.deleteAsync(result.uri, { idempotent: true }).finally(cancel)
          )
          .catch(() =>
            toast({ message: "Failed to share pdf", textColor: "red" })
          );
      })
      .catch(() =>
        toast({ message: "Failed to create pdf doc", textColor: "red" })
      )
      .finally(() => loading(false));
  }
  async function SavePDF(cancel: () => void) {
    loading("Preparing pdf doc file...");
    try {
      const permission =
        await fs.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permission.granted) {
        const result = await Print.printToFileAsync({
          width: 794,
          height: 1102,
          html,
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
    } finally {
      cancel();
      loading(false);
    }
  }
  function ShareImage(cancel: () => void) {
    if (editNote.text.length > contentLengthLimit()) {
      toast({
        message: `Note content is too large for sharing as image format. Limit is up to ${contentLengthLimit()} characters`,
        duration: 3500,
        textColor: "orange",
      });
      cancel();
      return;
    }
    loading("Preparing image...");
    setCapturing(true);
    if (editNote.title.length === 0) {
      setShowTitle(false);
    }
    setTimeout(() => {
      viewShotRef.current
        ?.capture()
        .then((image) => {
          Share.shareAsync(image).then(cancel);
        })
        .finally(() => loading(false));
    }, 100);
    setTimeout(() => {
      setCapturing(false);
      setShowTitle(true);
    }, 300);
  }
  function SaveImage(cancel: () => void) {
    if (editNote.text.length > contentLengthLimit()) {
      toast({
        message: `Note content is too large for saving as image format. Limit is up to ${contentLengthLimit()} characters`,
        duration: 3500,
        textColor: "orange",
      });
      cancel();
      return;
    }
    loading("Preparing image...");
    setCapturing(true);
    if (editNote.title.length === 0) {
      setShowTitle(false);
    }

    setTimeout(() => {
      viewShotRef.current
        ?.capture()
        .then((image) => {
          MediaLibrary.saveToLibraryAsync(image)
            .then(() => toast({ message: "Image saved to library" }))
            .then(cancel)
            .catch(() =>
              toast({ message: "Failed to save image", textColor: "red" })
            );
        })
        .catch(() =>
          toast({ message: "Failed to prepare image", textColor: "red" })
        )
        .finally(() => loading(false));
    }, 100);
    setTimeout(() => {
      setCapturing(false);
      setShowTitle(true);
    }, 300);
  }
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
          title: "Cancel",
          onPress: async () => {
            await Notifications.cancelScheduledNotificationAsync(id.toString());
            setEditNote((prev) => ({ ...prev, reminder: null }));
            toast({ message: "Canceled" });
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
