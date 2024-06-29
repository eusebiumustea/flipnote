import { useState } from "react";
import ColorPicker, {
  BrightnessSlider,
  HueSlider,
  SaturationSlider,
} from "reanimated-color-picker";
import { Button } from "../../../../components";
import { OptionProps } from "../../types";

export function ColorOptions({ defaultTextColor, onColorChange }: OptionProps) {
  const [noticeColorChange, setNoticeColorChange] = useState(defaultTextColor);

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
        onColorChange(hex);
        setNoticeColorChange(hex);
      }}
    >
      <HueSlider boundedThumb />
      <SaturationSlider boundedThumb />
      <BrightnessSlider boundedThumb />

      <Button
        onPress={() => {
          setNoticeColorChange(defaultTextColor);
          onColorChange(defaultTextColor);
        }}
        style={{ alignItems: "center", alignSelf: "flex-start" }}
      >
        Reset
      </Button>
    </ColorPicker>
  );
}
