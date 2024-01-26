import { useBackHandler } from "@react-native-community/hooks";
import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import * as Sharing from "expo-sharing";
import { MotiScrollView } from "moti";
import { memo, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { useRecoilState } from "recoil";
import { useToast } from "../../components/toast";
import { BackgroundImages } from "../../contexts";
import { useTheme } from "../../hooks";
import { useLoading } from "../../hooks/use-loading-dialog";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { verticalScale } from "../../tools";
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
  const navigation = useNavigation<StackNavigationHelpers>();
  useBackHandler(() => {
    navigation.popToTop();
    return true;
  });
  const theme = useTheme();
  const [backgroundImages] = useRecoilState(BackgroundImages);
  const [editNote, setEditNote] = useState<note>({
    id,
    title: "",
    text: "",
    isFavorite: false,
    background: "#fff",
    styles: [],
    reminder: null,
    contentPosition: "justify",
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
  const { currentFocused, openReminder, marginBottom } = useNoteUtils(
    id,
    selection,
    editNote,
    setEditNote,
    setReminderDialog
  );

  const imageRef = useRef<ViewShot>(null);
  // const [scrollHeight, setScrollHeight] = useState(1);
  const { top } = useSafeAreaInsets();
  const toast = useToast();

  const [capturing, setCapturing] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const loading = useLoading();
  async function Share() {
    try {
      if (editNote.title.length === 0) {
        setShowTitle(false);
      }
      loading(true);
      setCapturing(true);
      const image = await imageRef.current.capture();
      setCapturing(false);
      setShowTitle(true);
      loading(false);
      await Sharing.shareAsync(image);
    } catch (e) {
      console.log(e);
      toast({ message: String(e) });
      loading(false);
    }
  }
  const isImgBg = backgroundImages.includes(editNote.background);
  function captureBackground() {
    if (capturing && isImgBg) {
      return "#fff";
    }

    if (capturing && !isImgBg) {
      return editNote.background;
    }
    return null;
  }
  const scrollRef = useRef<ScrollView>(null);
  return (
    <>
      <MotiScrollView
        ref={scrollRef}
        transition={{
          type: "timing",
          duration: 400,
          delay: 300,
          backgroundColor: { delay: 0 },
        }}
        from={{ opacity: 0, backgroundColor: "transparent" }}
        animate={{
          opacity: 1,
          backgroundColor: !isImgBg ? editNote.background : "transparent",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingTop: verticalScale(70) + top,
        }}
        style={{
          flex: 1,
          marginBottom,
        }}
      >
        <ViewShot
          // onLayout={(e) => setScrollHeight(e.nativeEvent.layout.height)}
          style={{
            flex: 1,
            backgroundColor: captureBackground(),
            paddingHorizontal: 16,
            rowGap: verticalScale(12),
            paddingTop: capturing ? top : undefined,
            paddingBottom: capturing ? 0 : verticalScale(200),
          }}
          options={{
            result: "tmpfile",
            useRenderInContext: true,
            format: "png",
            fileName: `flipnote-${id}`,
          }}
          ref={imageRef}
        >
          {showTitle && (
            <NoteTitleInput setEditNote={setEditNote} editNote={editNote} />
          )}
          <NoteContentInput
            selection={selection}
            editNote={editNote}
            setSelection={setSelection}
            setEditNote={setEditNote}
          />
        </ViewShot>
      </MotiScrollView>
      <NoteOverlays
        isImageBackground={isImgBg}
        reminderDialog={reminderDialog}
        setReminderDialog={setReminderDialog}
        id={id}
        onReminderOpen={openReminder}
        onShare={Share}
        selection={selection}
        setEditNote={setEditNote}
        setReminder={setReminder}
        currentFocused={currentFocused}
        reminder={reminder}
        editNote={editNote}
      />
    </>
  );
});
