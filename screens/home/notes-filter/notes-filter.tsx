import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { moderateFontScale, useTheme } from "../../../tools";
import React from "react";
import { note } from "../..";
interface filterButtonProps {
  onSelected: () => void;
  selected: boolean;
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
interface NoteFilterBarProps {
  data: note[];
  onSelected: () => void;
  onSelectAll: () => void;
  selected: string[];
  favorite: boolean;
  onFavoriteSelected: () => void;
  notes: string[];
  selectedAll: boolean;
}
export function NoteFilterBar({
  onSelectAll,
  onSelected,
  selected,
  data,
  onFavoriteSelected,
  favorite,
  notes,
}: NoteFilterBarProps) {
  return (
    <FlatList
      style={{
        width: "100%",
        flexGrow: 0,
      }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: 14,
        columnGap: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      horizontal
      ListHeaderComponent={() => (
        <View
          style={{
            flexDirection: "row",
            columnGap: 12,
            alignItems: "center",
          }}
        >
          <FilterButton
            onSelected={onSelectAll}
            selected={selected.length > 0 ? false : true}
            label="All"
          />

          {data.filter((e) => e.isFavorite === true).length > 0 && (
            <FilterFavoritesButton
              selected={favorite}
              onSelected={onFavoriteSelected}
            />
          )}
        </View>
      )}
      data={notes}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <FilterButton
          key={item}
          onSelected={onSelected}
          selected={selected.includes(item)}
          label={item}
        />
      )}
    />
  );
}
