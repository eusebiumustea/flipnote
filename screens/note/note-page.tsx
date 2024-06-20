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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { darkCardColors } from "../../constants";
import { useEditNoteContent, useTheme } from "../../hooks";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { verticalScale } from "../../utils";
import { NoteContentInput } from "./note-content-input";
import { NoteOverlays } from "./note-overlays";
import { LoadingItem } from "./note-overlays/loading-item";
import { NoteTitleInput } from "./note-title-input";
import { InputSelectionProps, Note, ReminderProps } from "./types";
interface ParamsProps {
  id: number;
  isCreating: boolean;
  background: string;
}
type NotePageProps = {
  route: NavigatorScreenParams<{}>;
};
export const NotePage = memo(({ route }: NotePageProps) => {
  const theme = useTheme();
  const { id, isCreating, background }: ParamsProps = route.params;
  const [loadingProgress, setLoadingProgress] = useState(!isCreating);
  const [editNote, setEditNote] = useState<Note>({
    id,
    title: "",
    text: "",
    isFavorite: false,
    background: "#fff",
    styles: [],
    generalStyles: {},
    reminder: null,
    contentPosition: "left",
    imageOpacity: 0,
    imageData: "",
  });

  useNoteStorage(id, editNote, setEditNote, setLoadingProgress);
  const [reminder, setReminder] = useState<ReminderProps>({
    date: new Date(),
    time: new Date(),
  });
  const [selection, setSelection] = useState<InputSelectionProps>({
    start: 0,
    end: 0,
  });
  const [reminderDialog, setReminderDialog] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const { top } = useSafeAreaInsets();
  const [capturing, setCapturing] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const {
    currentSelectedStyle,
    openReminder,
    SaveImage,
    SavePDF,
    ShareImage,
    SharePDF,
  } = useNoteUtils(
    id,
    selection,
    editNote,
    setEditNote,
    setReminderDialog,
    setShowTitle,
    setCapturing,
    viewShotRef
  );
  const isImgBg = editNote.background.includes("/");
  const captureBackground = useMemo(() => {
    if (capturing && isImgBg) {
      return null;
    }
    if (capturing && !isImgBg) {
      return editNote.background;
    }
    return null;
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
  const { height, width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const { current } = useCardAnimation();
  const Content = useEditNoteContent(
    editNote.styles,
    editNote.text,
    editNote.background,
    editNote.imageOpacity,
    editNote.generalStyles?.color
      ? (editNote.generalStyles?.color as string)
      : defaultContentTheme
  );

  if (loadingProgress) {
    return <LoadingItem bg={background} />;
  }

  return (
    <>
      <ViewShot
        options={{
          result: "tmpfile",
          fileName: `flipnote-${id}`,
        }}
        ref={isImgBg ? viewShotRef : null}
        style={[
          {
            flex: 1,
            backgroundColor: !isImgBg ? editNote.background : null,
          },
        ]}
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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={verticalScale(52)}
          style={{
            flex: 1,
          }}
        >
          <Animated.ScrollView
            bounces={false}
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            contentContainerStyle={{
              paddingTop: capturing ? 0 : verticalScale(70) + top,
              paddingBottom: verticalScale(100),
            }}
            style={{
              flex: 1,
              opacity: current.progress,
            }}
          >
            <ViewShot
              style={{
                flex: 1,
                backgroundColor: captureBackground,
                paddingHorizontal: 16,
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
                  theme={theme}
                  setEditNote={setEditNote}
                  editNote={editNote}
                />
              )}

              <NoteContentInput
                inputSelection={selection}
                inputProps={{
                  caretHidden: capturing,
                  children: Content,
                }}
                setEditNote={setEditNote}
                editNote={editNote}
                setInputSelection={setSelection}
              />
            </ViewShot>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
      </ViewShot>

      <NoteOverlays
        saveImage={SaveImage}
        savePdf={SavePDF}
        defaultContentTheme={defaultContentTheme}
        shareImage={ShareImage}
        sharePdf={SharePDF}
        reminderDialog={reminderDialog}
        setReminderDialog={setReminderDialog}
        id={id}
        onReminderOpen={openReminder}
        selection={selection}
        setEditNote={setEditNote}
        setReminder={setReminder}
        currentSelectedStyle={currentSelectedStyle}
        reminder={reminder}
        editNote={editNote}
      />
    </>
  );
});
