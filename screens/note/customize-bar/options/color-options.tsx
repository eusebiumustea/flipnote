import ColorPicker, {
  BrightnessSlider,
  HueSlider,
  SaturationSlider,
} from "reanimated-color-picker";
import { Button } from "../../../../components";
import { OptionProps } from "../../types";
import { useState } from "react";
import { View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useTheme } from "../../../../hooks";
import { moderateFontScale } from "../../../../utils";
import { Controller, useForm } from "react-hook-form";

export function ColorOptions({ defaultTextColor, onColorChange }: OptionProps) {
  const [noticeColorChange, setNoticeColorChange] = useState(defaultTextColor);
  const theme = useTheme();
  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      option: 0,
    },
  });

  return (
    <ColorPicker
      style={{
        rowGap: 10,
        width: "100%",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      value={noticeColorChange}
      thumbShape="circle"
      onComplete={({ hex }) => {
        const { option } = getValues();
        onColorChange(hex, option === 0 ? "font-color" : "text-background");
        setNoticeColorChange(hex);
      }}
    >
      <HueSlider boundedThumb />
      <SaturationSlider boundedThumb />
      <BrightnessSlider boundedThumb />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          alignSelf: "center",
        }}
      >
        <Button
          onPress={handleSubmit(({ option }) => {
            if (option === 0) {
              setNoticeColorChange(defaultTextColor);
              onColorChange(defaultTextColor, "font-color");
            } else {
              setNoticeColorChange(defaultTextColor);
              onColorChange("transparent", "text-background");
            }
          })}
          style={{ alignItems: "center", alignSelf: "flex-start" }}
        >
          Reset
        </Button>
        <Controller
          name="option"
          render={({ field: { onChange, value } }) => (
            <SegmentedControl
              onChange={(e) => onChange(e.nativeEvent.selectedSegmentIndex)}
              selectedIndex={value}
              fontStyle={{ fontSize: moderateFontScale(14) }}
              style={{ flex: 1, backgroundColor: theme.primary }}
              values={["font color", "text background"]}
            />
          )}
          control={control}
        />
      </View>
    </ColorPicker>
  );
}
