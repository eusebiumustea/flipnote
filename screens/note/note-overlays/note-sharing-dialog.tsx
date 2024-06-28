import { Picker } from "@react-native-picker/picker";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, Platform, View } from "react-native";
import { BackgroundIcon, Dialog, PdfIcon } from "../../../components";
import { useTheme } from "../../../hooks";
interface NoteSharingDialogProps {
  visible: boolean;
  onCencel: () => void;
  sharePdf: (onCencel: () => void) => void;
  shareImage: (onCencel: () => void) => void;
  savePdf: (onCencel: () => void) => void;
  saveImage: (onCencel: () => void) => void;
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
      title="Share note content"
      onCencel={onCencel}
      styles={{ width: "90%" }}
      animation="fade"
      visible={visible}
      buttons={[
        {
          title: "Save",
          onPress: () => {
            if (option === 0) {
              saveImage(onCencel);
            } else {
              savePdf(onCencel);
            }
          },

          hidden: option !== 0 && Platform.OS === "ios",
        },
        {
          title: "Share",
          onPress: () => {
            if (option === 0) {
              shareImage(onCencel);
            } else {
              sharePdf(onCencel);
            }
          },
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
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
