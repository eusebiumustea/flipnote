import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Linking } from "react-native";
import { useRecoilState } from "recoil";
import { ImageBox, ImagePlusIcon, useToast } from "../../../../components";
import { ColorBox } from "../../../../components/color-box";
import { BackgroundImages } from "../../../../contexts/atom";
import { useTheme } from "../../../../hooks";
import { OptionProps } from "../../types";
export function BackgroundOptions({
  colors,
  setEditNote,
  editNote,
}: OptionProps) {
  const theme = useTheme();
  const [backgroundImages, setBackgroundImages] =
    useRecoilState(BackgroundImages);
  const imagesDir = `${FileSystem.documentDirectory}images`;
  const toast = useToast();
  async function checkImagesDir() {
    const { exists } = await FileSystem.getInfoAsync(imagesDir);
    if (!exists) {
      await FileSystem.makeDirectoryAsync(imagesDir);
    }
  }
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
      await checkImagesDir();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (result.canceled) {
        return;
      }

      const newImage = `${imagesDir}/${result.assets[0].fileName}`;
      if (backgroundImages.includes(newImage)) {
        return;
      }
      console.log("picked", result.assets[0].uri);
      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: newImage,
      });
      console.log("moved to", newImage);
      setBackgroundImages((prev) => [...prev, newImage]);
    } catch (error) {}
  }
  return (
    <>
      <ImagePlusIcon
        onPress={openImagePicker}
        svgProps={{ fill: theme.primary }}
      />
      {backgroundImages.map((uri, i) => {
        return (
          <ImageBox
            onPress={() =>
              setEditNote((prev) => ({ ...prev, background: uri }))
            }
            key={i}
            uri={uri}
            checked={editNote.background === uri}
          />
        );
      })}
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
