import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { memo, useMemo, useRef, useState } from "react";
import { Keyboard, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { useLoading } from "../../hooks/use-loading-dialog";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { verticalScale } from "../../utils";
import { NoteContentInput } from "./note-content-input";
import { NoteOverlays } from "./note-overlays";
import { NoteTitleInput } from "./note-title-input";
import { InputSelectionProps, ReminderProps, note } from "./types";
interface ParamsProps {
  id: number;
}
type NotePageProps = {
  route: NavigatorScreenParams<{}>;
};
export const NotePage = memo(({ route }: NotePageProps) => {
  const { id }: ParamsProps = route.params;
  const [editNote, setEditNote] = useState<note>({
    id,
    title: "",
    text: "",
    isFavorite: false,
    background: "#fff",
    styles: [],
    reminder: null,
    contentPosition: "left",
    imageOpacity: 0,
  });
  useNoteStorage(id, editNote, setEditNote);
  const [reminder, setReminder] = useState<ReminderProps>({
    date: new Date(),
    time: new Date(),
  });

  const [selection, setSelection] = useState<InputSelectionProps>({
    start: 0,
    end: 0,
  });
  const [reminderDialog, setReminderDialog] = useState(false);
  const { currentSelectedStyle, openReminder } = useNoteUtils(
    id,
    selection,
    editNote,
    setEditNote,
    setReminderDialog
  );

  const nav = useNavigation<StackNavigationHelpers>();
  const viewShotRef = useRef<ViewShot>(null);
  const { top } = useSafeAreaInsets();

  const [capturing, setCapturing] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const loading = useLoading();
  async function Share() {
    loading("Preparing image...");
    Keyboard.dismiss();
    setCapturing(true);
    if (editNote.title.length === 0) {
      setShowTitle(false);
    }
    setTimeout(async () => {
      try {
        const image = await viewShotRef.current.capture();
        if (editNote.title.length === 0) {
          setShowTitle(true);
        }
        setCapturing(false);
        loading(false);
        nav.navigate("image-preview", { uri: image });
      } catch (e) {
        loading(false);
      }
    }, 0);
  }
  const isImgBg = editNote.background.includes("/");
  const captureBackground = useMemo(() => {
    if (capturing && isImgBg) {
      // return "#fff";
      return null;
    }
    if (capturing && !isImgBg) {
      return editNote.background;
    }
    return null;
  }, [capturing, isImgBg]);
  const { height, width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <MotiView
      style={{ flex: 1 }}
      transition={
        {
          type: "timing",
          duration: 300,
          delay: 300,
          backgroundColor: { delay: 0 },
        } as any
      }
      from={{ opacity: 0, backgroundColor: "transparent" }}
      animate={{
        opacity: 1,
        backgroundColor: !isImgBg ? editNote.background : "transparent",
      }}
    >
      <ViewShot
        options={{
          result: "tmpfile",
          fileName: `flipnote-${id}`,
        }}
        ref={isImgBg ? viewShotRef : null}
        style={{
          flex: 1,
          marginBottom: verticalScale(52),
        }}
      >
        <>
          {isImgBg && (
            <>
              <MotiView
                transition={{ type: "timing", duration: 300 } as any}
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
                transition={{
                  duration: 300,
                  timing: "ease-in-out",
                }}
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

          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={{
              paddingTop: capturing ? 0 : verticalScale(70) + top,
              paddingBottom: verticalScale(100),
            }}
            style={{
              flex: 1,
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
                <NoteTitleInput setEditNote={setEditNote} editNote={editNote} />
              )}
              <NoteContentInput
                inputProps={{
                  caretHidden: capturing,
                }}
                setEditNote={setEditNote}
                editNote={editNote}
                setInputSelection={setSelection}
              />
            </ViewShot>
          </ScrollView>
        </>
      </ViewShot>
      <NoteOverlays
        reminderDialog={reminderDialog}
        setReminderDialog={setReminderDialog}
        id={id}
        onReminderOpen={openReminder}
        onShare={Share}
        selection={selection}
        setEditNote={setEditNote}
        setReminder={setReminder}
        currentSelectedStyle={currentSelectedStyle}
        reminder={reminder}
        editNote={editNote}
      />
    </MotiView>
  );
});
