import { Slider } from "@miblanchard/react-native-slider";
import { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../../hooks";
import { moderateFontScale } from "../../../../utils";
export function FontSizeOptions({
  onValueChange,
  onReset,
}: {
  onValueChange: (value: number) => void;
  onReset: () => void;
}) {
  const theme = useTheme();

  const [showValue, setShowValue] = useState(3);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 9,
        borderRadius: 8,
        width: "100%",
      }}
    >
      <Slider
        containerStyle={{ bottom: 10 }}
        onValueChange={(value) => {
          setShowValue(Math.round(value[0]));
          onValueChange(Math.round(value[0]));
        }}
        renderAboveThumbComponent={(i, value) => (
          <Text
            style={{
              color: theme.primary,
              top: 5,
              right: 5,
              fontSize: moderateFontScale(12),
            }}
          >
            {Math.round(value)}
          </Text>
        )}
        thumbStyle={{ backgroundColor: "teal" }}
        maximumTrackTintColor={theme.primary}
        minimumTrackTintColor={"#007AFF"}
        trackStyle={{ width: "100%" }}
        minimumValue={1}
        value={showValue}
        step={1}
        maximumValue={7}
      />

      {showValue !== 3 && (
        <Text
          onPress={() => {
            setShowValue(3);
            onReset();
          }}
          style={{
            color: theme.primary,
            alignSelf: "flex-start",
            position: "absolute",
            bottom: 0,
          }}
        >
          Reset
        </Text>
      )}
    </View>
  );
}
