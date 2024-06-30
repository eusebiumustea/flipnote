import React, { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-fast-text";
import { useTheme } from "../../../hooks";
import { moderateFontScale } from "../../../utils";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
interface filterButtonProps {
  onSelected: () => void;
  selected: boolean;
  label?: string;
}
export const ResetButton = memo(
  ({ onSelected, selected }: filterButtonProps) => {
    const theme = useTheme();
    return (
      <TouchableOpacity
        onPress={onSelected}
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.onPrimary : theme.primary,
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: moderateFontScale(12),
            color: selected ? theme.primary : theme.onPrimary,
            fontFamily: "OpenSans",
          }}
        >
          All
        </Text>
      </TouchableOpacity>
    );
  }
);
export const FilterButton = memo(
  ({ onSelected, selected, label }: filterButtonProps) => {
    const theme = useTheme();
    return (
      <TouchableOpacity
        onPress={onSelected}
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.onPrimary : theme.primary,
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 6,
        }}
        activeOpacity={0.7}
      >
        {selected && (
          <FontAwesome size={10} color={theme.primary} name="check" />
        )}
        <Text
          numberOfLines={1}
          style={{
            fontSize: moderateFontScale(12),
            color: selected ? theme.primary : theme.onPrimary,
            fontFamily: "OpenSans",
          }}
        >
          {label.length > 40 ? `${label.slice(0, 40)}...` : label}
        </Text>
      </TouchableOpacity>
    );
  }
);

export const FilterFavoritesButton = memo(
  ({ onSelected, selected }: filterButtonProps) => {
    const theme = useTheme();
    return (
      <TouchableOpacity
        onPress={onSelected}
        activeOpacity={0.7}
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: selected ? theme.yellowAccent : theme.yellow,
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 4,
        }}
      >
        {selected && (
          <MaterialIcons size={10} color={theme.onPrimary} name="favorite" />
        )}
        <Text
          style={{
            fontSize: moderateFontScale(12),
            fontFamily: "OpenSans",
            color: theme.onPrimary,
          }}
        >
          Favorites
        </Text>
      </TouchableOpacity>
    );
  }
);
