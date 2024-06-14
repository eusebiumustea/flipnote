import { Picker } from "@react-native-picker/picker";
import { useCallback, useState } from "react";
import { Platform, View } from "react-native";
import { BackgroundIcon, Dialog, PdfIcon } from "../../../components";
import { useTheme } from "../../../hooks";
import * as fs from "expo-file-system";
interface NoteSharingDialogProps {
  visible: boolean;
  onCencel: () => void;
  sharePdf: () => Promise<void>;
  shareImage: () => Promise<void>;
  savePdf: () => Promise<void>;
  saveImage: () => Promise<void>;
}

export function NoteSharingDialog({
  visible,
  shareImage,
  sharePdf,
  onCencel,
  saveImage,
  savePdf,
}: NoteSharingDialogProps) {
  const [option, setOption] = useState<number>(0);
  const Icon = useCallback(() => {
    return options.find((_, i) => i === option)?.icon;
  }, [option]);
  const theme = useTheme();
  const options = [
    { label: "Image", icon: <BackgroundIcon color={theme.onPrimary} /> },
    { label: "PDF", icon: <PdfIcon /> },
  ];

  return (
    <Dialog
      title="Share note content as:"
      onCencel={onCencel}
      styles={{ width: "90%" }}
      animation="fade"
      visible={visible}
      buttonsContainerStyle={{
        justifyContent: "center",
        position: "relative",
        marginVertical: -10,
      }}
      buttons={[
        {
          title: "Save",
          onPress() {
            if (option === 0) {
              saveImage().then(onCencel);
            } else {
              savePdf().then(onCencel);
            }
          },
          hidden: option !== 0 && Platform.OS === "ios",
        },
        {
          title: "Share",
          onPress() {
            if (option === 0) {
              shareImage().then(onCencel);
            } else {
              sharePdf().then(onCencel);
            }
          },
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingVertical: 8,
        }}
      >
        <Icon />
        <Picker
          style={{ flex: 1 }}
          selectedValue={option}
          mode="dropdown"
          dropdownIconColor={theme.onPrimary}
          onValueChange={(_, i) => setOption(i)}
        >
          {options.map(({ label }, i) => {
            return (
              <Picker.Item
                color={theme.onPrimary}
                key={i}
                style={{ backgroundColor: theme.primary }}
                value={i}
                label={label}
              />
            );
          })}
        </Picker>
      </View>
    </Dialog>
  );
}
