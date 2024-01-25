import {
  NavigationHelpers,
  NavigationProp,
  NavigatorScreenParams,
  useNavigation,
} from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { AnimatePresence, MotiImage, MotiScrollView } from "moti";
import { memo, useRef, useState } from "react";
import {
  PixelRatio,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { useRecoilState } from "recoil";
import { useToast } from "../../components/toast";
import { BackgroundImages } from "../../contexts";
import { useEditNoteContent, useTheme } from "../../hooks";
import { useLoading } from "../../hooks/use-loading-dialog";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { moderateFontScale, range, verticalScale } from "../../tools";
import { NoteOverlays } from "./note-overlays";
import { InputSelectionProps, ReminderProps, note } from "./types";
import { useBackHandler } from "@react-native-community/hooks";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
interface ParamsProps {
  id: number;
}
type NotePageProps = {
  route: NavigatorScreenParams<{}>;
};
export const NotePage = memo(({ route }: NotePageProps) => {
  const { id } = route.params;
  const navigation = useNavigation<StackNavigationHelpers>();
  useBackHandler(() => {
    navigation.popToTop();
    return true;
  });
  const { width, height } = useWindowDimensions();
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
  const [scrollHeight, setScrollHeight] = useState(1);

  const { top } = useSafeAreaInsets();
  const toast = useToast();

  const [capturing, setCapturing] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const loading = useLoading();
  async function Share() {
    try {
      loading(true);
      if (editNote.title.length === 0) {
        setShowTitle(false);
      }
      setCapturing(true);
      const image = await imageRef.current.capture();
      setCapturing(false);
      setShowTitle(true);
      await Sharing.shareAsync(image);
      loading(false);
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
      <AnimatePresence>
        {isImgBg && (
          <MotiImage
            from={{ opacity: 0 }}
            animate={{ opacity: isImgBg ? 1 : 0 }}
            transition={{
              type: "timing",
              duration: 400,
              delay: 0,
            }}
            width={width}
            height={height + top}
            source={{
              uri: editNote.background,
            }}
            style={{
              zIndex: -1,
              position: "absolute",
            }}
          />
        )}
      </AnimatePresence>

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
          onLayout={(e) => setScrollHeight(e.nativeEvent.layout.height)}
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
            <TextInput
              placeholderTextColor={theme.placeholder}
              onChangeText={(editedTitle) =>
                setEditNote((prev) => ({
                  ...prev,
                  title: editedTitle,
                }))
              }
              underlineColorAndroid="transparent"
              cursorColor={"#FFCB09"}
              placeholder={"Title"}
              multiline
              style={{
                color: "#000",
                fontSize: moderateFontScale(28),
                fontWeight: "bold",
                fontFamily: "OpenSans",
              }}
            >
              <Text>{editNote.title}</Text>
            </TextInput>
          )}

          <TextInput
            maxLength={200000}
            onSelectionChange={({ nativeEvent: { selection } }) => {
              setSelection(selection);
            }}
            placeholderTextColor={theme.placeholder}
            cursorColor={"#FFCB09"}
            autoCapitalize="sentences"
            autoCorrect={false}
            spellCheck={false}
            inputMode="text"
            onChangeText={(text) => {
              if (text.length > editNote.text.length) {
                setEditNote((prev) => ({
                  ...prev,
                  text,
                  styles: prev.styles.map((style, i) => {
                    if (selection.end <= style.interval.start) {
                      return {
                        ...style,
                        interval: {
                          start: style.interval.start + 1,
                          end: style.interval.end + 1,
                        },
                      };
                    }
                    return style;
                  }),
                }));
                return;
              }
              if (text.length < editNote.text.length) {
                setEditNote((prev) => ({
                  ...prev,
                  text,
                  styles: prev.styles.map((style, i) => {
                    if (selection.end <= style.interval.start) {
                      return {
                        ...style,
                        interval: {
                          start: style.interval.start - 1,
                          end: style.interval.end - 1,
                        },
                      };
                    }
                    return style;
                  }),
                }));
                return;
              }
              setEditNote((prev) => ({
                ...prev,
                text,
              }));
            }}
            multiline
            placeholder="Take the note"
          >
            {useEditNoteContent(editNote.styles, editNote.text)}
          </TextInput>
        </ViewShot>
      </MotiScrollView>
      <NoteOverlays
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
