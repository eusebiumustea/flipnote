import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Checkbox from "expo-checkbox";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { memo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { Dialog } from "../../../components";
import { CloseIcon, DeleteIcon, ExportIcon } from "../../../components/assets";
import { useTheme } from "../../../hooks";
import {
  moderateFontScale,
  moderateScale,
  recalculateId,
  removeEmptySpace,
  replaceElementAtId,
} from "../../../tools";
import { TextNoteStyle, notesData } from "../../note";
import { unzip } from "../../../tools/zip-manager";
interface NoteOptionsProps {
  onDelete: () => void;
  onClose: () => void;
  onTotalSelect: () => void;
  totalSelected: boolean;
  onModalOpen: () => void;
  onImport?: () => void;
  showModal: boolean;
  onModalClose: () => void;
  selectedNotes: number[];
  onChangeText?: (e: string) => void;
  textValue?: string;
}

export const NoteOptions = memo(
  ({
    onDelete,
    onClose,
    onTotalSelect,
    totalSelected,
    onImport,
    onModalOpen,
    showModal,
    onModalClose,
    selectedNotes,
  }: NoteOptionsProps) => {
    const theme = useTheme();
    const { top } = useSafeAreaInsets();
    const [notes, setNotes] = useRecoilState(notesData);
    const shareNotes = notes.data.filter((e) => selectedNotes.includes(e.id));

    async function Share() {
      try {
        const zip = new JSZip();
        shareNotes.forEach((note) => {
          zip.folder(
            `${
              note.title.length > 0
                ? note.title.substring(0, 40)
                : note.text.substring(0, 30)
            }`
          );
          zip.file(
            `${
              note.title.length > 0
                ? removeEmptySpace(note.title.substring(0, 40))
                : removeEmptySpace(note.text.substring(0, 30))
            }/${
              note.title.length > 0
                ? removeEmptySpace(note.title.substring(0, 40))
                : removeEmptySpace(note.text.substring(0, 30))
            }.txt`,
            `${note.title}\n${note.text}`
          );
          {
            note.styles.length > 0 &&
              zip.file(
                `${
                  note.title.length > 0
                    ? removeEmptySpace(note.title.substring(0, 40))
                    : removeEmptySpace(note.text.substring(0, 30))
                }/styles${note.id}.json`,
                `${JSON.stringify(note.styles)}`
              );
          }
        });
        zip
          .generateAsync({ type: "base64", compression: "STORE" })
          .then(async function (content) {
            await FileSystem.writeAsStringAsync(
              `${FileSystem.documentDirectory}flipnotebackup.zip`,
              content,
              {
                encoding: "base64",
              }
            );
            await Sharing.shareAsync(
              `${FileSystem.documentDirectory}flipnotebackup.zip`,
              {
                mimeType: "application/zip",
              }
            );
            await FileSystem.deleteAsync(
              `${FileSystem.documentDirectory}flipnotebackup.zip`,
              {
                idempotent: true,
              }
            );
          });
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          position: "absolute",
          backgroundColor: theme.background,
          zIndex: 6,
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: moderateScale(20),
          padding: 10,
          top: 0,
          paddingTop: top,
        }}
      >
        <Dialog
          actionLabel={"Share"}
          title={`Share selected ${
            shareNotes.length === 1 ? "note" : "notes"
          } as zip archive format?`}
          visible={showModal}
          onCencel={onModalClose}
          action={Share}
          animation="fade"
          backgroundBlur={Platform.OS === "ios"}
          styles={{ width: "90%", borderRadius: 16 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexDirection: "column",
              alignItems: "center",
            }}
            style={{ width: "100%", top: 10 }}
          >
            {shareNotes.map((e, i) => (
              <Text
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: moderateFontScale(16),
                  fontFamily: "OpenSans",
                  color: theme.onPrimary,

                  borderRadius: 6,
                  padding: 5,
                }}
              >
                {e.title.length > 0
                  ? removeEmptySpace(e.title.substring(0, 60))
                  : removeEmptySpace(e.text.substring(0, 60))}
              </Text>
            ))}
          </ScrollView>
          {/* <TextInput
            onChangeText={onChangeText}
            value={textValue}
            placeholderTextColor={theme.onBackgroundSearch}
            placeholder="Archive password (*optional)"
            style={{
              width: "100%",
              borderWidth: 1,
              color: theme.onPrimary,
              fontFamily: "OpenSans",
              paddingLeft: 10,
              backgroundColor: theme.backgroundSearch,
              marginBottom: 10,
            }}
          />
          {textValue.length > 0 && (
            <Text
              style={{
                color: "red",
                fontSize: moderateFontScale(13),
                paddingBottom: 10,
                textAlign: "center",
              }}
            >
              Warning: If you forget your password, you may lose access to your
              data.
            </Text>
          )} */}
        </Dialog>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 10,
          }}
        >
          <CloseIcon onPress={onClose} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={onTotalSelect}
          >
            <Checkbox
              onValueChange={onTotalSelect}
              style={{ borderRadius: 100 }}
              value={totalSelected}
            />
            <Text
              numberOfLines={2}
              style={{
                color: theme.onPrimary,
                fontFamily: "OpenSans",
              }}
            >
              Select all
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}
        >
          <Text
            onPress={async () => {
              // await FileSystem.deleteAsync(
              //   `${FileSystem.documentDirectory}flipnote`,
              //   { idempotent: true }
              // ).then((e) => console.log("deleted"));
              await DocumentPicker.getDocumentAsync({
                type: "application/zip",
              }).then(async (result) => {
                if (result.canceled) {
                  return;
                }
                const zipFilePath = result.assets[0].uri;
                unzip(zipFilePath, "flipnote").then(
                  async (unzippedDirectory) => {
                    await FileSystem.readDirectoryAsync(unzippedDirectory).then(
                      async (res) => {
                        console.log(res);
                        if (res.length > 0) {
                          res.map(async (src) => {
                            await FileSystem.readDirectoryAsync(
                              `${unzippedDirectory}/${src}`
                            ).then(async (files) => {
                              const noteContent = files.find(
                                (e) =>
                                  e.slice(0, e.lastIndexOf(".") + 1) + "txt" ===
                                  e
                              );
                              const noteStyles = files.find(
                                (e) =>
                                  e.slice(0, e.lastIndexOf(".") + 1) +
                                    "json" ===
                                  e
                              );

                              await FileSystem.readAsStringAsync(
                                `${unzippedDirectory}/${src}/${noteContent}`
                              ).then((text) => {
                                console.log(text);
                                setNotes((prev) => ({
                                  ...prev,
                                  data: recalculateId([
                                    ...prev.data,
                                    {
                                      id: prev.data.length + 1,
                                      title: "",
                                      text,
                                      isFavorite: false,
                                      background: "#fff",
                                      styles: [],
                                      reminder: null,
                                    },
                                  ]),
                                }));
                              });
                              if (noteStyles) {
                                // await FileSystem.readAsStringAsync(
                                //   `${unzippedDirectory}/${src}/${noteStyles}`
                                // ).then((style) => {
                                //   const parsedStyle: TextNoteStyle[] =
                                //     JSON.parse(style);
                                //   const currentNote = notes.data.find(
                                //     (e) => e.id === notes.data.length
                                //   );
                                //   setNotes((prev) => ({
                                //     ...prev,
                                //     data: recalculateId(
                                //       replaceElementAtId(prev.data, 1, {
                                //         ...currentNote,
                                //         styles: parsedStyle,
                                //       })
                                //     ),
                                //   }));
                                // });
                              }
                            });
                          });
                        }
                        console.log(notes.data);
                        // await FileSystem.deleteAsync(unzippedDirectory, {
                        //   idempotent: true,
                        // });
                      }
                    );
                  }
                );
                // await unzip(
                //   result.assets[0].uri,
                //   FileSystem.cacheDirectory
                // ).then((path) => {
                //   console.log(`unzip completed at ${path}`);
                // });
              });
            }}
          >
            Import
          </Text>
          <ExportIcon onPress={onModalOpen} />
          <DeleteIcon onPress={onDelete} />
        </View>
      </View>
    );
  }
);
