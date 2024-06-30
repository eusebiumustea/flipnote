import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useState } from "react";
import { Platform, View } from "react-native";
import { Dialog } from "../../../components";
import { useTheme } from "../../../hooks";
import Animated, {
  FadeIn,
  ZoomInDown,
  ZoomInUp,
} from "react-native-reanimated";
interface NoteSharingDialogProps {
  visible: boolean;
  onCancel: () => void;
  sharePdf: (onCancel: () => void) => void;
  shareImage: (onCancel: () => void) => void;
  savePdf: (onCancel: () => void) => void;
  saveImage: (onCancel: () => void) => void;
}

export function NoteSharingDialog({
  visible,
  shareImage,
  sharePdf,
  onCancel,
  saveImage,
  savePdf,
}: NoteSharingDialogProps) {
  const [option, setOption] = useState<number>(0);
  const Icon = useCallback(() => {
    const iconName = options.find((_, i) => i === option)?.icon;
    return <FontAwesome5 size={30} color={theme.onPrimary} name={iconName} />;
  }, [option]);
  const theme = useTheme();
  const options = [
    { label: "Image", icon: "file-image" },
    { label: "PDF", icon: "file-pdf" },
  ];

  return (
    <Dialog
      title="Share note content"
      onCancel={onCancel}
      styles={{ width: "90%" }}
      animation="fade"
      visible={visible}
      buttons={[
        {
          title: "Save",
          onPress: () => {
            if (option === 0) {
              saveImage(onCancel);
            } else {
              savePdf(onCancel);
            }
          },

          hidden: option !== 0 && Platform.OS === "ios",
        },
        {
          title: "Share",
          onPress: () => {
            if (option === 0) {
              shareImage(onCancel);
            } else {
              sharePdf(onCancel);
            }
          },
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 26,
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
