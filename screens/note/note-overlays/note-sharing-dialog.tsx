import { useState } from "react";
import { Dialog } from "../../../components";
import { Pressable, TouchableOpacity, View } from "react-native";
import Checkbox from "expo-checkbox";
import { useTheme } from "../../../hooks";
import { Text } from "react-native-fast-text";
interface NoteSharingDialogProps {
  visible: boolean;
  onCencel: () => void;
  sharePdf: () => void;
  shareImage: () => void;
}
const options = ["Pdf document", "Image"];
export function NoteSharingDialog({
  visible,
  shareImage,
  sharePdf,
  onCencel,
}: NoteSharingDialogProps) {
  const [option, setOption] = useState<string>("Image");
  const theme = useTheme();
  return (
    <Dialog
      actionLabel="Share"
      title="Share note content as:"
      onCencel={onCencel}
      styles={{ width: "90%" }}
      animation="fade"
      visible={visible}
      action={() => {
        if (option === "Image") {
          shareImage();
        } else {
          sharePdf();
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingVertical: 8,
        }}
      >
        {options.map((label, i) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setOption(label)}
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              key={i}
            >
              <Checkbox value={option === label} />
              <Text style={{ color: theme.onPrimary, fontSize: 17 }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Dialog>
  );
}
