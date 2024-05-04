import { FlatList, View } from "react-native";
import { FilterButton, FilterFavoritesButton } from "./notes-filter";
import { HomeOverlaysProps } from "../home-overlays/types";
import { removeArrayKeyDuplicates, toggleArrayElement } from "../../../utils";
import { memo, useMemo } from "react";

export const NotesFilterList = memo(
  ({
    searchFilter,
    selected,
    setSelected,
    favorite,
    setFavorite,
    data,
  }: HomeOverlaysProps) => {
    const notesWithoutCopies = useMemo(() => {
      return removeArrayKeyDuplicates(searchFilter, "title");
    }, [searchFilter, selected]);

    return (
      <FlatList
        style={{
          width: "100%",
          flexGrow: 0,
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 14,
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
              onSelected={() => setSelected([])}
              selected={selected.length === 0}
              label="All"
            />
            {data.filter((e) => e.isFavorite === true).length > 0 && (
              <FilterFavoritesButton
                selected={favorite}
                onSelected={() => setFavorite((prev) => !prev)}
              />
            )}
          </View>
        )}
        data={notesWithoutCopies}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <FilterButton
            key={item}
            onSelected={() =>
              setSelected((prev) => toggleArrayElement(prev, item))
            }
            selected={selected.includes(item)}
            label={item}
          />
        )}
      />
    );
  }
);
