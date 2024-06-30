import Checkbox from "expo-checkbox";
import { memo, useMemo } from "react";
import { FlatList, Platform, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-fast-text";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilValue } from "recoil";
import { Dialog } from "../../../../components";
import {
  CloseIcon,
  DeleteIcon,
  ExportIcon,
} from "../../../../components/assets";
import { useTheme } from "../../../../hooks";
import { useStorageUtils } from "../../../../hooks/use-storage-utils";
import {
  moderateFontScale,
  moderateScale,
  removeEmptySpace,
  verticalScale,
} from "../../../../utils";
import { NotePreviewTypes, notesValue } from "../../../note";
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
    const { Share, Save } = useStorageUtils();
    const theme = useTheme();
    const { top } = useSafeAreaInsets();
    const notes = useRecoilValue(notesValue);
    const shareNotes = useMemo(() => {
      return notes.filter((e) => selectedNotes.includes(e.id));
    }, [selectedNotes, notes]);

    return (
      <Animated.View
        entering={FadeIn.springify(1000)}
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
          title={`Share selected ${
            shareNotes.length === 1 ? "note" : "notes"
          } as zip archive format?`}
          visible={showModal}
          onCancel={onModalClose}
          buttons={[
            {
              title: "Save",
              onPress: () => Save(shareNotes, "flipnotebackup"),

              hidden: Platform.OS === "ios",
            },
            {
              title: "Share",
              onPress: () => Share(shareNotes, "flipnotebackup"),
            },
          ]}
          animation="fade"
          backgroundBlur={Platform.OS === "ios"}
          styles={{ width: "90%", borderRadius: 16 }}
        >
          <FlatList
            data={shareNotes}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }: { item: NotePreviewTypes }) => {
              return (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: moderateFontScale(16),
                    fontFamily: "OpenSans",
                    color: theme.onPrimary,

                    borderRadius: 6,
                    padding: 5,
                  }}
                >
                  {item.title.length > 0
                    ? removeEmptySpace(item.title.substring(0, 60))
                    : removeEmptySpace(item.text.substring(0, 60))}
                </Text>
              );
            }}
            contentContainerStyle={{
              flexDirection: "column",
              alignItems: "center",
            }}
            style={{ width: "100%", marginVertical: 32 }}
          />
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
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: moderateScale(5),
            }}
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
      </Animated.View>
    );
  }
);
