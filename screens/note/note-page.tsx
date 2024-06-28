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
import { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { darkCardColors } from "../../constants";
import { useTheme } from "../../hooks";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { debounce, verticalScale } from "../../utils";
import { ReanimatedView } from "../../utils/reanimated-view";
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
  const { current, closing } = useCardAnimation();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();

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
            fileName: `flipnote-${id}`,
            format: "jpg",
          }}
          ref={isImgBg ? viewShotRef : null}
          style={{
            flex: 1,
            backgroundColor: captureBackground,
          }}
        >
          {isImgBg && (
            <>
              <MotiView
                transition={{ type: "timing", duration: 200 }}
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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Animated.ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                !capturing && {
                  paddingBottom: verticalScale(200),
                  paddingTop: verticalScale(70) + top,
                }
              }
              style={{
                flex: 1,
                opacity: closing && current.progress,
              }}
            >
              <ViewShot
                style={{
                  backgroundColor: captureBackground,
                  paddingVertical: capturing && editNote.title.length > 0 && 12,
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
                  placeholder="Take the note"
                  ref={editorRef}
                  editorInitializedCallback={() =>
                    !isCreating &&
                    editorRef.current.setContentHTML(editNote.text)
                  }
                  editorStyle={{
                    backgroundColor: "transparent",
                    color: defaultContentTheme,
                    placeholderColor: theme.placeholder,
                    initialCSSText: "div h1 {font-size: 16px}",
                  }}
                  onChange={debounce((html: string) => {
                    setEditNote((prev) => ({ ...prev, text: html }));
                  }, 0)}
                />
              </ViewShot>
            </Animated.ScrollView>
          </KeyboardAvoidingView>
        </ViewShot>
      </ReanimatedView>
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
        onReminderOpen={openReminder}
        setEditNote={setEditNote}
        setReminder={setReminder}
        reminder={reminder}
        editNote={editNote}
      />
    </MotiView>
  );
});
