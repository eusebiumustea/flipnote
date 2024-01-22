import React, { memo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../hooks";
import { moderateFontScale } from "../../../tools";
interface filterButtonProps {
  onSelected: () => void;
  selected: boolean;
  label?: string;
}
export const FilterButton = memo(
  ({ onSelected, selected, label }: filterButtonProps) => {
    const theme = useTheme();
    return (
      <TouchableOpacity
        activeOpacity={0.6}
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
      >
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
        activeOpacity={0.6}
        onPress={onSelected}
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: selected ? theme.yellowAccent : theme.yellow,
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
