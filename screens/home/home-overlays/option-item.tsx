import { ReactNode } from "react";
import {
  ColorValue,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-fast-text";
import { useTheme } from "../../../hooks";
export interface OptionItemProps {
  icon: ReactNode;
  label: string;
  textColor?: ColorValue | string;
  onPress: () => void;
}
export function OptionItem({
  icon,
  label,
  onPress,
  textColor,
}: OptionItemProps) {
  const theme = useTheme();
  return (
    <TouchableHighlight
      touchSoundDisabled
      onPress={onPress}
      underlayColor={theme.hoverColor}
      style={{
        borderRadius: 4,
        paddingVertical: 12,
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {icon}
        <Text
          style={{
            color: textColor || theme.onPrimary,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableHighlight>
  );
}
