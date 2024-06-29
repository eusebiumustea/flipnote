import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import * as Clipboard from "expo-clipboard";
import { forwardRef, useState } from "react";
import { RichEditor } from "react-native-pell-rich-editor";
import { DateTimePickerDialog, useToast } from "../../../components";
import { useNoitication } from "../../../hooks/use-notification-handler";
import { extractText } from "../../../utils";
import { CustomizeBar } from "../customize-bar";
import { NoteScreenHeader } from "../note-screen-header";
import { NoteInfo } from "./note-info";
import { NoteSharingDialog } from "./note-sharing-dialog";
import { NoteOverlaysProps } from "./types";
export const NoteOverlays = forwardRef(
  (
    {
      editNote,
      reminder,
      setReminder,
      setEditNote,
      onReminderOpen,
      reminderDialog,
      defaultContentTheme,
      setReminderDialog,
      shareImage,
      sharePdf,
      saveImage,
      savePdf,
      noteStateIsEmpty,
      textFiltered,
    }: NoteOverlaysProps,
    editorRef: React.MutableRefObject<RichEditor>
  ) => {
    const {
      params: { id },
    } = useRoute<RouteProp<{}>>();
    const notification = useNoitication();
    const [sharingDialog, setSharingDialog] = useState(false);
    const [showNoteInfo, setShowNoteInfo] = useState<{ x: number; y: number }>(
      null
    );

    const toast = useToast();

    const navigation = useNavigation<StackNavigationHelpers>();
    return (
      <>
        <CustomizeBar
          defaultTextColor={defaultContentTheme}
          ref={editorRef}
          editNote={editNote}
          setEditNote={setEditNote}
        />
        <NoteInfo
          show={showNoteInfo !== null}
          startPositionX={showNoteInfo?.x}
          startPositionY={showNoteInfo?.y}
          onClose={() => setShowNoteInfo(null)}
        />
        <NoteSharingDialog
          visible={sharingDialog}
          shareImage={shareImage}
          sharePdf={sharePdf}
          saveImage={saveImage}
          savePdf={savePdf}
          onCancel={() => setSharingDialog(false)}
        />
        <DateTimePickerDialog
          action={() => {
            notification(
              editNote.title || "",
              extractText(editNote.text) || "",
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
          onCancel={() => setReminderDialog(false)}
        />

        <NoteScreenHeader
          emptyNote={noteStateIsEmpty}
          background={editNote.background}
          onShowNoteInfo={({
            nativeEvent: { pageX, pageY, locationX, locationY },
          }) =>
            setShowNoteInfo({ x: pageX - locationX + 15, y: pageY - locationY })
          }
          iconsThemeColor={
            editNote.background.includes("/") ? "#fff" : defaultContentTheme
          }
          onReminderOpen={onReminderOpen}
          onClipboardCopy={async ({ nativeEvent: { pageX } }) => {
            try {
              await Clipboard.setStringAsync(textFiltered);
              toast({
                message: "Copied",
                scaleAnimation: {
                  x: pageX,
                  y: -30,
                },
              });
            } catch (error) {
              toast({
                message: "Note is too large to copy in clipboard",
                textColor: "orange",
                scaleAnimation: { x: pageX, y: -30 },
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
          onShare={() => setSharingDialog(true)}
        />
      </>
    );
  }
);
