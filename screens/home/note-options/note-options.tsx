import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useKeyboard } from "@react-native-community/hooks";
import { BlurView } from "expo-blur";
import JSZip from "jszip";
import { useRecoilState } from "recoil";
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  ExportIcon,
} from "../../../components/assets";
import { moderateFontScale, moderateScale, useTheme } from "../../../tools";
import { notesData } from "../../note";
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
export function NoteOptions({
  onDelete,
  onClose,
  onTotalSelect,
  totalSelected,

  onImport,
  onModalOpen,
  showModal,
  onModalClose,
  selectedNotes,
  onChangeText,
  textValue,
}: NoteOptionsProps) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const [notes, setNotes] = useRecoilState(notesData);
  const shareNotes = notes.data.filter((e) => selectedNotes.includes(e.id));
  const { height, width } = useWindowDimensions();
  const keyboard = useKeyboard();
  async function Share() {
    try {
      // await FileSystem.makeDirectoryAsync(
      //   `${FileSystem.documentDirectory}flipnotebackup`
      // );

      // for (let i = 0; i < shareNotes.length; i++) {
      //   await FileSystem.writeAsStringAsync(
      //     `${FileSystem.documentDirectory}flipnotebackup/${
      //       shareNotes[i].title.length > 40
      //         ? shareNotes[i].title.slice(0, 40)
      //         : shareNotes[i].title
      //     }.txt`,
      //     `Title: ${shareNotes[i].title}   Text: ${shareNotes[i].text}`
      //   );
      // }
      // await FileSystem.readDirectoryAsync(
      //   `${FileSystem.documentDirectory}flipnotebackup`
      // ).then((e) => console.log(e));

      const zip = new JSZip();
      shareNotes.forEach((note) => {
        zip.file(
          `${note.title.substring(0, 40)}.txt`,
          `Title: ${note.title} Text: ${note.text}`
        );
        console.log("zipping", zip.length);
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

      // if (textValue.length > 0) {
      //   zipWithPassword(
      //     `${FileSystem.documentDirectory}flipnotebackup`,
      //     `${FileSystem.documentDirectory}flipnotebackup.zip`,
      //     textValue
      //   ).then((e) => console.log(e));
      // }
      // zip(
      //   `${FileSystem.documentDirectory}flipnotebackup`,
      //   `${FileSystem.documentDirectory}flipnotebackup.zip`
      // )
      //   .then((path) => {
      //     console.log(`zip completed at ${path}`);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
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
        top,
      }}
    >
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent
        onRequestClose={onModalClose}
        visible={showModal}
      >
        <BlurView
          tint="dark"
          intensity={50}
          style={{
            flex: 1,
            backgroundColor: theme.onPrimary,
            zIndex: -1,
          }}
        />
        <View
          style={{
            width: "100%",
            backgroundColor: theme.primary,
            height: "auto",
            justifyContent: "center",
            alignSelf: "center",
            padding: 10,
            position: "absolute",
            top: keyboard.keyboardShown
              ? keyboard.keyboardHeight
              : height / 2.3,
            zIndex: 1,
            flexDirection: "column",
            maxHeight: height / 2.3,
            paddingBottom: 30,
            elevation: 10,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              padding: 10,
              color: theme.onPrimary,
              fontSize: moderateFontScale(16),
            }}
          >
            Share selected {shareNotes.length === 1 ? "note" : "notes"} as zip
            archive format?
          </Text>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingTop: 30,
              flexDirection: "column",
              alignItems: "center",
              rowGap: 5,
            }}
            style={{ width: "100%" }}
          >
            {shareNotes.map((e, i) => (
              <Text
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: moderateFontScale(16),
                  fontFamily: "google-sans",
                  color: "#000",
                  backgroundColor: e.background,
                  borderRadius: 6,
                  padding: 5,
                }}
              >
                {e.title}
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
              fontFamily: "google-sans",
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
          <View
            style={{
              columnGap: 30,
              flexDirection: "row",
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 10,
            }}
          >
            <TouchableOpacity onPress={onModalClose}>
              <Text
                style={{
                  fontSize: moderateFontScale(15),
                  fontFamily: "google-sans",
                  fontWeight: "bold",
                  color: theme.onPrimary,
                }}
              >
                Cencel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={Share}>
              <Text
                style={{
                  fontSize: moderateFontScale(15),
                  fontFamily: "google-sans",
                  fontWeight: "bold",
                  color: theme.onPrimary,
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          <CheckIcon
            fill={theme.onPrimary}
            onPress={onTotalSelect}
            focused={totalSelected}
          />
          <Text
            numberOfLines={2}
            style={{
              color: theme.onPrimary,
              fontFamily: "google-sans",
            }}
          >
            Select all
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 25 }}
      >
        <ExportIcon onPress={onModalOpen} />
        <DeleteIcon onPress={onDelete} />
      </View>
    </View>
  );
}
