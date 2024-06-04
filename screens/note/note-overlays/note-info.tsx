import { AnimatePresence, MotiView } from "moti";
import { Text } from "react-native-fast-text";
import { useTheme } from "../../../hooks";
import { Modal, Platform, useWindowDimensions } from "react-native";
import { MotiPressable } from "moti/interactions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { dateTime, formatBytes, verticalScale } from "../../../utils";
import { Easing } from "react-native-reanimated";
import { useEffect, useMemo, useState } from "react";
import * as fs from "expo-file-system";
import { NOTES_PATH, contentLengthLimit } from "../../../constants";
import { shadows } from "../../../ui-config";
interface NoteInfoProps {
  id: number;
  show: boolean;
  onClose: () => void;
  textLength: number;
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

export function NoteInfo({
  id,
  show,
  onClose,
  startPositionX,
  textLength,
}: NoteInfoProps) {
  const theme = useTheme();
  const [info, setInfo] = useState({ size: 0 });
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
    setInfo({ size });
  }
  const infoObj = useMemo(
    () => ({
      Size: formatBytes(info.size),
      "Created at": dateTime(new Date(id)),
      "Characters count": `${textLength}/${contentLengthLimit() + 1000}`,
    }),
    [info]
  );

  return (
    <AnimatePresence>
      {show && (
        <Modal transparent onRequestClose={onClose}>
          <MotiPressable
            onPress={onClose}
            transition={{ type: "timing", duration: 120 }}
            style={{
              width,
              height: height + top,
              backgroundColor: "#000",

              position: "absolute",
              zIndex: -1,
            }}
            from={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
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
            }}
            from={{
              translateY: verticalScale(-70),
              translateX: -width / 2 + startPositionX,
              scale: 0,
            }}
            animate={{
              translateY: 0,
              translateX: 0,
              scale: 1,
            }}
            exit={{
              translateY: verticalScale(-70),
              translateX: -width / 2 + startPositionX,
              scale: 0,
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
