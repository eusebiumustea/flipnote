import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Linking } from "react-native";
import { useRecoilState } from "recoil";
import { ImageBox, ImagePlusIcon, useToast } from "../../../../components";
import { ColorBox } from "../../../../components/color-box";
import { imagesData } from "../../../../constants";
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

      if (!backgroundImages.includes(result.assets[0].uri)) {
        setBackgroundImages((prev) => [...prev, result.assets[0].uri]);
        await FileSystem.writeAsStringAsync(
          imagesData,
          JSON.stringify(backgroundImages)
        );
      }
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
