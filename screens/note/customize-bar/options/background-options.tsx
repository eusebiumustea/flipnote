import * as ImagePicker from "expo-image-picker";
import { Linking } from "react-native";
import { ImagePlusIcon, useToast } from "../../../../components";
import { ColorBox } from "../../../../components/color-box";
import { useTheme } from "../../../../hooks";
import { OptionProps } from "../../types";
export function BackgroundOptions({
  colors,
  setEditNote,
  editNote,
}: OptionProps) {
  const theme = useTheme();

  const toast = useToast();

  async function openImagePicker() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(
        true
      );
      if (status === ImagePicker.PermissionStatus.DENIED) {
        toast({
          message: "Media access permission denied",
          button: {
            title: "Open settings",
            onPress: () => Linking.openSettings(),
          },
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (result.canceled) {
        return;
      }
      setEditNote((prev) => ({ ...prev, background: result.assets[0].uri }));
    } catch (error) {}
  }

  return (
    <>
      <ImagePlusIcon
        onPress={openImagePicker}
        svgProps={{ fill: theme.primary }}
      />
      {colors.map((e, i) => {
        return (
          <ColorBox
            onPress={() => setEditNote((prev) => ({ ...prev, background: e }))}
            bgColor={e}
            key={i}
            checked={editNote.background === e}
          />
        );
      })}
    </>
  );
}
