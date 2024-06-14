import * as Notifications from "expo-notifications";
import * as Print from "expo-print";
import * as fs from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useToast } from "../components";
import { InputSelectionProps, Note } from "../screens";
import { dateTime, range } from "../utils";
import { useLoading } from "./use-loading-dialog";
import { useHTMLRenderedContent } from "./use-note-content";
import { shareAsync } from "expo-sharing";
import { Keyboard, Platform } from "react-native";
import ViewShot from "react-native-view-shot";
export function useNoteUtils(
  id: number,
  selection: InputSelectionProps,
  editNote: Note,
  setEditNote: Dispatch<SetStateAction<Note>>,
  setReminderDialog: Dispatch<SetStateAction<boolean>>,
  setShowTitle: Dispatch<SetStateAction<boolean>>,
  setCapturing: Dispatch<SetStateAction<boolean>>,
  viewShotRef: React.MutableRefObject<ViewShot>
) {
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const toast = useToast();
  const setLoading = useLoading();
  const html = useHTMLRenderedContent(
    editNote.styles,
    editNote.text,
    editNote.title,
    editNote.background,
    editNote.imageOpacity,
    editNote.contentPosition,
    editNote.imageData
  );
  const scheduleDateForNotification =
    editNote.reminder && new Date(editNote.reminder);
  async function SharePDF() {
    try {
      setLoading("Preparing PDF...");
      const result = await Print.printToFileAsync({
        html,
        width: 794,
        height: 1102,
        useMarkupFormatter: !isImgBg,
      });

      await shareAsync(result.uri, {
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
          html,
          width: 794,
          height: 1102,
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
      Keyboard.dismiss();
      setCapturing(true);
      if (editNote.title.length === 0) {
        setShowTitle(false);
      }
      const image = await viewShotRef.current.capture();

      if (editNote.title.length === 0) {
        setShowTitle(true);
      }
      setCapturing(false);

      await shareAsync(image);
      if (Platform.OS === "android") {
        await fs.deleteAsync(image, { idempotent: true });
      }
    } catch (error) {
      toast({ message: "Failed to share image", textColor: "red" });
    } finally {
      setLoading(false);
    }
  }
  async function SaveImage() {
    try {
      setLoading("Preparing image...");
      Keyboard.dismiss();
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
      setLoading(false);
      toast({ message: "Image saved to library" });
    } catch (error) {
      setLoading(false);
      toast({ message: "Failed to save image", textColor: "red" });
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
  const currentSelectedStyle = useMemo(() => {
    if (selection.end > selection.start) {
      return editNote.styles.find(
        (e) =>
          (selection.start < e.interval.start &&
            selection.end > e.interval.end &&
            Object.keys(e.style).length > 0) ||
          (range(e.interval.start, e.interval.end).includes(
            selection.start + 1
          ) &&
            Object.keys(e.style).length > 0) ||
          (range(e.interval.start, e.interval.end).includes(
            selection.end - 1
          ) &&
            Object.keys(e.style).length > 0)
      );
    }
  }, [selection, editNote.styles]);

  return {
    currentSelectedStyle,
    openReminder,
    SaveImage,
    SavePDF,
    ShareImage,
    SharePDF,
  };
}
