import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Checkbox from "expo-checkbox";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { memo, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilValue } from "recoil";
import { Dialog } from "../../../components";
import { CloseIcon, DeleteIcon, ExportIcon } from "../../../components/assets";
import { useTheme } from "../../../hooks";
import { useLoading } from "../../../hooks/use-loading-dialog";
import {
  moderateFontScale,
  moderateScale,
  removeEmptySpace,
  verticalScale,
} from "../../../utils";
import { note, notesValue } from "../../note";
import { NOTES_PATH } from "../../../constants";
interface NoteOptionsProps {
  onDelete: () => void;
  onClose: () => void;
  onTotalSelect: () => void;
  totalSelected: boolean;
  onModalOpen: () => void;
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
    onModalOpen,
    showModal,
    onModalClose,
    selectedNotes,
  }: NoteOptionsProps) => {
    const loading = useLoading();
    const theme = useTheme();
    const { top } = useSafeAreaInsets();
    const notes = useRecoilValue(notesValue);
    const shareNotes = useMemo(() => {
      return notes.filter((e) => selectedNotes.includes(e.id));
    }, [selectedNotes, notes]);

    async function Share() {
      try {
        loading(true);
        const output = `${FileSystem.cacheDirectory}flipnotebackup.zip`;
        const zip = new JSZip();
        await Promise.all(
          shareNotes.map(async (note) => {
            const noteStorageContent = await FileSystem.readAsStringAsync(
              `${NOTES_PATH}/${note.id}`
            );
            const parsedNote: note = JSON.parse(noteStorageContent);
            if (parsedNote.background.includes("/")) {
              zip.file(
                `${note.id}`,
                JSON.stringify({
                  ...parsedNote,
                  background: "#fff",
                  imageOpacity: 0,
                })
              );
              return;
            }
            zip.file(`${note.id}`, noteStorageContent);
          })
        );
        const zipContent = await zip.generateAsync({
          type: "base64",
          compression: "STORE",
        });

        await FileSystem.writeAsStringAsync(output, zipContent, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(output, {
          mimeType: "application/zip",
        });
      } catch (error) {
      } finally {
        onModalClose();
        loading(false);
      }
    }

    return (
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          position: "absolute",
          backgroundColor: theme.background,
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: moderateScale(20),
          padding: 10,
          top: 0,
          paddingTop: top,
          height: verticalScale(70) + top,
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
            style={{ width: "100%" }}
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
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={onTotalSelect}
            activeOpacity={0.6}
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
          <Text
            style={{ color: theme.onPrimary, fontSize: moderateFontScale(18) }}
          >
            {selectedNotes.length}/{notes.length}
          </Text>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}
        >
          <ExportIcon onPress={onModalOpen} />
          <DeleteIcon onPress={onDelete} />
        </View>
      </View>
    );
  }
);
