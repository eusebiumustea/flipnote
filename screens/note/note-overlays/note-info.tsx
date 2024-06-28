import * as fs from "expo-file-system";
import { AnimatePresence, MotiView } from "moti";
import { useEffect, useMemo, useState } from "react";
import { Modal, Platform, Pressable, useWindowDimensions } from "react-native";
import { Text } from "react-native-fast-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NOTES_PATH } from "../../../constants";
import { useTheme } from "../../../hooks";
import { shadows } from "../../../ui-config";
import {
  dateTime,
  extractText,
  formatBytes,
  verticalScale,
} from "../../../utils";
import { Note } from "../types";
import { RouteProp, useRoute } from "@react-navigation/native";
interface NoteInfoProps {
  show: boolean;
  onClose: () => void;
  startPositionX?: number;
  startPositionY?: number;
}
type FileInfoTypes = {
  exists: true;
  uri: string;
  size: number;
  isDirectory: boolean;
  modificationTime: number;
  md5?: string;
};

export function NoteInfo({ show, onClose, startPositionX }: NoteInfoProps) {
  const {
    params: { id },
  } = useRoute<RouteProp<{}>>();
  const theme = useTheme();
  const [info, setInfo] = useState({ size: 0, textLength: 0 });
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  useEffect(() => {
    if (show) {
      getInfo();
    }
  }, [show]);
  async function getInfo() {
    const notePath = `${NOTES_PATH}/${id}`;
    const { size } = (await fs.getInfoAsync(notePath, {
      size: true,
    })) as FileInfoTypes;
    const data = await fs.readAsStringAsync(notePath);
    const note: Note = JSON.parse(data);
    setInfo({
      size,
      textLength: extractText(note.text).length + note.title.length,
    });
  }
  const infoObj = useMemo(
    () => ({
      Size: formatBytes(info.size),
      "Created at": dateTime(new Date(id)),
      "Characters count": `${info.textLength}`,
    }),
    [info]
  );

  return (
    <AnimatePresence>
      {show && (
        <Modal transparent visible={show} onRequestClose={onClose}>
          <Pressable
            onPress={onClose}
            style={{
              width,
              height: height + top,

              position: "absolute",
              zIndex: -1,
            }}
          />
          <MotiView
            transition={{ type: "timing", duration: 120 }}
            style={{
              padding: 16,
              backgroundColor: theme.primary,
              borderRadius: 16,
              top: Platform.OS === "ios" && top,
              marginTop: verticalScale(40),
              alignSelf: "center",
              gap: 16,
              ...shadows(theme),
            }}
            from={{
              translateY: verticalScale(-70),
              translateX: -width / 2 + startPositionX,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              translateX: 0,
              scale: 1,
              opacity: 1,
            }}
            exit={{
              translateY: verticalScale(-70),
              translateX: -width / 2 + startPositionX,
              scale: 0,
              opacity: 0,
            }}
          >
            {Object.entries(infoObj).map((prop, i) => {
              return (
                <Text key={i} style={{ color: theme.onPrimary }}>
                  {`${prop[0]}: ${prop[1]}`}
                </Text>
              );
            })}
          </MotiView>
        </Modal>
      )}
    </AnimatePresence>
  );
}
