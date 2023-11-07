import { Text, TouchableOpacity } from "react-native";
import { moderateFontScale, useTheme } from "../../../tools";
import React from "react";
interface filterButtonProps {
  onSelected?: any;
  selected?: boolean;
  label?: string;
}
export const FilterButton = ({
  onSelected,
  selected,
  label,
}: filterButtonProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onSelected}
      style={{
        borderRadius: 8,
        borderWidth: selected ? 1 : 1,
        borderColor: selected ? theme.primary : theme.border,
        backgroundColor: selected ? theme.onPrimary : theme.primary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: moderateFontScale(12),
          color: selected ? theme.primary : theme.onPrimary,
        }}
      >
        {label.length > 40 ? `${label.slice(0, 40)}...` : label}
      </Text>
    </TouchableOpacity>
  );
};
export function FilterFavoritesButton({
  onSelected,
  selected,
}: filterButtonProps) {
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
        paddingVertical: 6,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: moderateFontScale(12),
          // color: theme.onPrimary,
        }}
      >
        Favorites
      </Text>
    </TouchableOpacity>
  );
}
