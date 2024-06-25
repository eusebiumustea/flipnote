import { NavigatorScreenParams } from "@react-navigation/native";
import { useCardAnimation } from "@react-navigation/stack";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { memo, useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { darkCardColors } from "../../constants";
import { useTheme } from "../../hooks";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { debounce, verticalScale } from "../../utils";
import { NoteOverlays } from "./note-overlays";
import { LoadingItem } from "./note-overlays/loading-item";
import { NoteTitleInput } from "./note-title-input";
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
  const { top } = useSafeAreaInsets();
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
  const scrollRef = useRef<ScrollView>(null);
  const { width, height } = useWindowDimensions();
  const { current, closing } = useCardAnimation();
  const theme = useTheme();

  if (loadingProgress) {
    return <LoadingItem bg={background} />;
  }
  return (
    <MotiView
      style={{ flex: 1 }}
      transition={{ type: "timing", duration: 300 }}
      from={{ backgroundColor: background }}
      animate={{
        backgroundColor: !isImgBg ? editNote.background : null,
      }}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 100, type: "timing", duration: 200 }}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ViewShot
            options={{
              result: "tmpfile",
              fileName: `flipnote-${id}`,
              format: "jpg",
            }}
            ref={isImgBg ? viewShotRef : null}
            style={{
              flex: 1,
            }}
          >
            {isImgBg && (
              <>
                <MotiView
                  transition={{ type: "timing", duration: 200 } as any}
                  from={{ opacity: 0 }}
                  animate={{ opacity: editNote.imageOpacity }}
                  style={{
                    height: height + top,
                    width,
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    backgroundColor: "#000",
                  }}
                />
                <Image
                  source={{
                    uri: editNote.background,
                  }}
                  style={{
                    height: height + top,
                    width,
                    position: "absolute",
                    zIndex: -2,
                    top: 0,
                  }}
                />
              </>
            )}

            <Animated.ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="none"
              contentContainerStyle={{
                paddingBottom: verticalScale(200),
                paddingTop: capturing ? 0 : verticalScale(70) + top,
              }}
              style={{
                flex: 1,
                opacity: closing && current.progress,
              }}
            >
              <ViewShot
                style={{
                  backgroundColor: captureBackground,
                  rowGap: verticalScale(12),
                  paddingVertical: !isImgBg && capturing && 16,
                }}
                options={{
                  result: "tmpfile",
                  useRenderInContext: !isImgBg,
                  fileName: `flipnote-${id}`,
                }}
                ref={!isImgBg ? viewShotRef : null}
              >
                {showTitle && (
                  <NoteTitleInput
                    editNote={editNote}
                    setEditNote={setEditNote}
                  />
                )}

                <RichEditor
                  initialContentHTML={editNote.text}
                  placeholder="Take the note"
                  ref={editorRef}
                  bounces={false}
                  editorStyle={{
                    backgroundColor: "transparent",
                    color: defaultContentTheme,
                    placeholderColor: theme.placeholder,
                  }}
                  onChange={debounce((html: string) => {
                    setEditNote((prev) => ({ ...prev, text: html }));
                  }, 0)}
                />
              </ViewShot>
            </Animated.ScrollView>
          </ViewShot>
        </KeyboardAvoidingView>
      </MotiView>

      <NoteOverlays
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
        id={id}
        onReminderOpen={openReminder}
        setEditNote={setEditNote}
        setReminder={setReminder}
        reminder={reminder}
        editNote={editNote}
      />
    </MotiView>
  );
});
