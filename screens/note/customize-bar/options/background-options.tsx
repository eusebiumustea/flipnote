import { Slider } from "@miblanchard/react-native-slider";
import * as ImagePicker from "expo-image-picker";
import * as fs from "expo-file-system";
import { Linking, ScrollView, View } from "react-native";
import { ImageBox, ImagePlusIcon, useToast } from "../../../../components";
import { ColorBox } from "../../../../components/color-box";
import { darkCardColors } from "../../../../constants/colors";
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
        base64: true,
      });

      if (result.canceled) {
        return;
      }
      setEditNote((prev) => ({
        ...prev,
        background: result.assets[0].uri,
        imageData: `data:image/${result.assets[0].fileName.slice(
          result.assets[0].fileName.lastIndexOf(".") + 1
        )};base64,${result.assets[0].base64}`,
      }));
    } catch (error) {}
  }

  return (
    <View style={{ flexDirection: "column" }}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        style={{ flex: 1 }}
        bounces={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ImagePlusIcon
          onPress={openImagePicker}
          svgProps={{ fill: theme.primary }}
        />
        {editNote.background.includes("/") && (
          <ImageBox checked uri={editNote.background} />
        )}
        {colors.map((e, i) => {
          return (
            <ColorBox
              onPress={() => {
                setEditNote((prev) => ({
                  ...prev,
                  imageOpacity: 0,
                  background: e,
                  imageData: "",
                }));
              }}
              bgColor={e}
              key={i}
              checked={editNote.background === e}
              checkedColor={darkCardColors.includes(e) ? "#fff" : "#000"}
            />
          );
        })}
      </ScrollView>
      {editNote.background.includes("/") && (
        <Slider
          value={editNote.imageOpacity}
          maximumValue={1}
          minimumValue={0}
          onSlidingComplete={(value) =>
            setEditNote((prev) => ({
              ...prev,
              imageOpacity: value[0],
            }))
          }
        />
      )}
    </View>
  );
}
