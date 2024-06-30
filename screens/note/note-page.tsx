import { NavigatorScreenParams } from "@react-navigation/native";
import { MotiView } from "moti";
import { memo, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { FadeInUp, useSharedValue } from "react-native-reanimated";
import ViewShot from "react-native-view-shot";
import { darkCardColors } from "../../constants";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { dateTime } from "../../utils";
import { ReanimatedView } from "../../utils/reanimated-view";
import { NoteBackgroundImage } from "./note-background-image";
import { NoteContentEditor } from "./note-content-editor";
import { NoteOverlays } from "./note-overlays";
import { LoadingItem } from "./note-overlays/loading-item";
import { Note, ReminderProps } from "./types";
interface ParamsProps {
  id: number;
  isCreating: boolean;
  background: string;
}
type NotePageProps = {
  route: NavigatorScreenParams<{}>;
};
export const NotePage = memo(({ route }: NotePageProps) => {
  const { id, isCreating, background }: ParamsProps = route.params;
  const [loadingProgress, setLoadingProgress] = useState(!isCreating);

  const [editNote, setEditNote] = useState<Note>({
    id,
    title: "",
    text: "",
    isFavorite: false,
    background: "#fff",
    reminder: null,
    imageOpacity: 0,
    imageData: "",
  });

  const textFiltered = useMemo(() => {
    return editNote.text.replace(/<(.|\n)*?>/g, "").trim();
  }, [editNote.text]);
  const noteStateIsEmpty =
    textFiltered.length === 0 && editNote.title.length === 0;
  const editorRef = useRef<RichEditor>(null);
  useNoteStorage(
    id,
    editNote,
    setEditNote,
    setLoadingProgress,
    noteStateIsEmpty
  );

  const [reminder, setReminder] = useState<ReminderProps>({
    date: new Date(),
    time: new Date(),
  });
  const [reminderDialog, setReminderDialog] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const [capturing, setCapturing] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  const { openReminder, SaveImage, SavePDF, ShareImage, SharePDF } =
    useNoteUtils(
      id,
      editNote,
      setEditNote,
      setReminderDialog,
      setShowTitle,
      setCapturing,
      viewShotRef,
      noteStateIsEmpty
    );

  const isImgBg = editNote.background.includes("/");
  const captureBackground = useMemo(() => {
    if (capturing && isImgBg) {
      return "transparent";
    }
    if (capturing && !isImgBg) {
      return editNote.background;
    }
    return "transparent";
  }, [capturing, isImgBg]);
  const defaultContentTheme = useMemo(() => {
    if (editNote.imageOpacity > 0.4) {
      return "#ffffff";
    }
    if (darkCardColors.includes(editNote.background)) {
      return "#ffffff";
    } else {
      return "#000000";
    }
  }, [editNote.imageOpacity, editNote.background]);
  const bottomSpace = useSharedValue(0);
  const conditionalViewShotRef = useMemo(() => {
    if (Platform.OS === "ios") {
      return viewShotRef;
    }
    return isImgBg ? viewShotRef : null;
  }, [isImgBg]);
  if (loadingProgress) {
    return <LoadingItem bg={background} />;
  }
  return (
    <MotiView
      style={{ flex: 1 }}
      from={{ backgroundColor: background }}
      animate={{
        backgroundColor: !isImgBg ? editNote.background : null,
      }}
    >
      <ReanimatedView
        entering={!isCreating && FadeInUp.duration(300).delay(200)}
        style={{ flex: 1 }}
      >
        <ViewShot
          options={{
            result: "tmpfile",
            fileName: `flipnote-${dateTime(new Date(), false)}`,
            format: "jpg",
            quality: 0.9,
            useRenderInContext: !isImgBg,
          }}
          ref={conditionalViewShotRef}
          style={{
            flex: 1,
            backgroundColor: captureBackground,
          }}
        >
          <NoteBackgroundImage
            show={isImgBg}
            overlayOpacity={editNote.imageOpacity}
            uri={editNote.background}
          />

          <NoteContentEditor
            ref={editorRef}
            bottomSpace={bottomSpace}
            viewShotRef={viewShotRef}
            captureBackground={captureBackground}
            defaultContentTheme={defaultContentTheme}
            showTitle={showTitle}
            editNote={editNote}
            setEditNote={setEditNote}
            capturing={capturing}
          />
        </ViewShot>
      </ReanimatedView>
      <NoteOverlays
        bottomSpace={bottomSpace}
        ref={editorRef}
        textFiltered={textFiltered}
        noteStateIsEmpty={noteStateIsEmpty}
        saveImage={SaveImage}
        savePdf={SavePDF}
        defaultContentTheme={defaultContentTheme}
        shareImage={ShareImage}
        sharePdf={SharePDF}
        reminderDialog={reminderDialog}
        setReminderDialog={setReminderDialog}
        onReminderOpen={openReminder}
        setEditNote={setEditNote}
        setReminder={setReminder}
        reminder={reminder}
        editNote={editNote}
      />
    </MotiView>
  );
});
