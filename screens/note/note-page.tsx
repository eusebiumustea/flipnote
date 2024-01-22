import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";

import { NavigationProp } from "@react-navigation/native";
import { AnimatePresence, MotiImage, MotiScrollView } from "moti";
import { memo, useRef, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TextStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { useRecoilState } from "recoil";
import { useToast } from "../../components/toast";
import { fontNames } from "../../constants";
import { BackgroundImages } from "../../contexts";
import { useEditNoteContent, useTheme } from "../../hooks";
import { useNoteStorage } from "../../hooks/use-note-manager";
import { useNoteUtils } from "../../hooks/use-note-utills";
import { useNoitication } from "../../hooks/use-notification-handler";
import { moderateFontScale, verticalScale } from "../../tools";
import { cardColors } from "../../tools/colors";
import {
  BackgroundOptions,
  ColorOptions,
  CustomizeBar,
  FontOptions,
  FontSizeOptions,
} from "./customize-bar";
import { DateTimePickerDialog } from "./date-time-picker";
import { NoteScreenHeader } from "./note-screen-header";
import { StyleChanges } from "./style-changes";
import { StyleEvent, onFontColor } from "./style-events";
import { InputSelectionProps, OptionProps, ReminderProps, note } from "./types";
interface ParamsProps {
  id: number;
}
type NotePageProps = {
  navigation: NavigationProp<any>;
  route: {
    params: ParamsProps;
  };
};
export const NotePage = memo(({ route, navigation }: NotePageProps) => {
  const { id } = route.params;
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
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
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
  const { currentFocused, openReminder, marginBottom, fontFamilyFocused } =
    useNoteUtils(id, selection, editNote, setEditNote, setReminderDialog);

  const currentIndex = editNote.styles.indexOf(currentFocused);

  const imageRef = useRef<ViewShot>(null);

  const { top } = useSafeAreaInsets();
  const toast = useToast();

  const [changes, setShowChanges] = useState(false);
  function setStyleEvent(key: keyof TextStyle, value: string) {
    return StyleEvent(
      currentFocused,
      key,
      value,
      selection,
      setEditNote,
      currentIndex
    );
  }
  const optionsProps: OptionProps = {
    selection,
    currentFocused,
    currentIndex,
    setEditNote,
    colors: cardColors,
    editNote,
    fontFamilyFocused,
    fonts: fontNames,
  };
  const [capturing, setCapturing] = useState(false);
  const notification = useNoitication();

  async function Share() {
    try {
      setCapturing(true);
      const imageUri = await imageRef.current.capture();
      setCapturing(false);
      await Sharing.shareAsync(imageUri);
    } catch (e) {
      console.log(e);
      toast({ message: "Note is too large" });
    }
  }
  const isImgBg = backgroundImages.includes(editNote.background);
  function captureBackground() {
    if (capturing && isImgBg) {
      return "#fff";
    }
    if (!capturing && isImgBg) {
      return null;
    }
    return editNote.background;
  }
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
            handleGLSurfaceViewOnAndroid: true,
          }}
          ref={imageRef}
        >
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
            placeholder={capturing ? "" : "Title"}
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

          <TextInput
            onSelectionChange={({ nativeEvent: { selection } }) => {
              setSelection(selection);
            }}
            placeholderTextColor={theme.placeholder}
            cursorColor={"#FFCB09"}
            autoCapitalize="sentences"
            autoCorrect={false}
            spellCheck={false}
            inputMode="text"
            onChangeText={(text) =>
              setEditNote((prev) => ({
                ...prev,
                text,
              }))
            }
            multiline
            placeholder="Take the note"
          >
            {useEditNoteContent(editNote.styles, editNote.text)}
          </TextInput>
        </ViewShot>
      </MotiScrollView>

      <DateTimePickerDialog
        action={() => {
          notification(
            editNote.title ? editNote.title : null,
            editNote.text ? editNote.text : null,
            id,
            reminder,
            setEditNote
          );
          setReminderDialog(false);
        }}
        onChangeTime={(_, date) =>
          setReminder((prev) => ({ ...prev, time: date }))
        }
        onChangeDate={(_, date) => {
          setReminder((prev) => ({ ...prev, date }));
        }}
        onChangeDateAndroid={(event, date) => {
          if (event.type === "set") {
            setReminder((prev) => ({ ...prev, date }));
            DateTimePickerAndroid.open({
              is24Hour: true,
              mode: "time",
              value: reminder.time,
              positiveButton: { label: "Finish" },
              onError(arg) {
                toast({ message: arg.message });
              },
              display: "spinner",
              onChange(event, date) {
                if (event.type === "set") {
                  setReminder((prev) => ({ ...prev, time: date }));
                }
              },
            });
          }
        }}
        show={reminderDialog}
        time={reminder.time}
        date={reminder.date}
        onCencel={() => setReminderDialog(false)}
      />

      <NoteScreenHeader
        historyShown={editNote.styles.length > 0}
        onHistoryOpen={() => setShowChanges(true)}
        onReminderOpen={openReminder}
        onClipboard={async () => {
          if (noteStateIsEmpty) {
            return;
          }
          try {
            await Clipboard.setStringAsync(
              `${editNote.title}\n${editNote.text}`
            );
            toast({
              message: "Copied",
              startPositionX: 80,
              startPositionY: 10,
              fade: true,
            });
          } catch (error) {
            toast({
              message: "Note is too large to copy in clipboard",
              textColor: "orange",
            });
          }
        }}
        onFavoriteAdd={() =>
          setEditNote((prev) => ({
            ...prev,
            isFavorite: !prev.isFavorite,
          }))
        }
        onBack={() => navigation.goBack()}
        favorite={editNote.isFavorite}
        onShare={Share}
      />
      <StyleChanges
        background={editNote.background}
        text={editNote.text}
        setEditNote={setEditNote}
        styles={editNote.styles}
        opened={changes}
        onClose={() => setShowChanges(false)}
      />
      <CustomizeBar
        focusedColor={currentFocused?.style?.color}
        selection={selection}
        italicFocused={currentFocused?.style?.fontStyle === "italic"}
        onItalic={() => setStyleEvent("fontStyle", "italic")}
        onBold={() => setStyleEvent("fontWeight", "bold")}
        boldFocused={currentFocused?.style?.fontWeight === "bold"}
        onUnderline={() => setStyleEvent("textDecorationLine", "underline")}
        underLinedFocused={
          currentFocused?.style?.textDecorationLine === "underline"
        }
        onFontColor={() =>
          onFontColor(currentFocused, selection, setEditNote, currentIndex)
        }
        fontSizeOptions={<FontSizeOptions {...optionsProps} />}
        fontColorOptions={<ColorOptions {...optionsProps} />}
        backgroundOptions={<BackgroundOptions {...optionsProps} />}
        fontOptions={<FontOptions {...optionsProps} />}
      />
    </>
  );
});
