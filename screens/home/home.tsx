import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, View, useAnimatedValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { Header, CreateIcon, NoteCard } from "../../components";
import {
  excludeElemnts,
  removeArrayKeyDuplicates,
  toggleArrayElement,
  useTheme,
  verticalScale,
} from "../../tools";
import { note, notesData } from "../note";
import { NoteOptions } from "./note-options/note-options";
import { FilterButton, FilterFavoritesButton } from "./notes-filter";
export function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [optionsSelection, setOptionsSelection] = useState<note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top } = useSafeAreaInsets();

  const data = useMemo(() => {
    const searchFiltered = notes.data.filter(
      (e) =>
        e.text.includes(searchQuery.toLowerCase()) ||
        e.title.includes(searchQuery.toLowerCase())
    );
    if (searchQuery.length > 0) {
      return searchFiltered;
    } else {
      return notes.data;
    }
  }, [searchQuery, notes]);
  const filteredData = useMemo(() => {
    const newData = data.filter((e) => selected.includes(e.title));
    if (selected.length > 0) {
      return favorite ? newData.filter((e) => e.isFavorite === true) : newData;
    } else {
      return favorite ? data.filter((e) => e.isFavorite === true) : data;
    }
  }, [data, selected, favorite]);

  const notesWithoutCopies = useMemo(() => {
    return removeArrayKeyDuplicates(data, "title");
  }, [data, selected]);
  useMemo(() => {
    if (filteredData.filter((e) => e.isFavorite === true).length === 0) {
      setFavorite(false);
    }
  }, [favorite, filteredData]);
  useMemo(() => {
    if (notes.data.length === 0) {
      setOptionsSelection([]);
    }
  }, [notes]);
  useMemo(() => {
    if (
      optionsSelection.length > 0 &&
      favorite &&
      notes.data.filter((e) => e.isFavorite === true).length === 0
    ) {
      setOptionsSelection([]);
    }
  }, [notes.data, optionsSelection]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: theme.background,
      }}
    >
      {optionsSelection.length === 0 && (
        <Header
          scrollY={scrollY}
          searchValue={searchQuery}
          onSearch={setSearchQuery}
          extraHeight={optionsSelection.length === 0 && verticalScale(40)}
        >
          {optionsSelection.length === 0 && (
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
                    onSelected={() => setSelected([])}
                    selected={selected.length > 0 ? false : true}
                    label="All"
                  />

                  {filteredData.filter((e) => e.isFavorite === true).length >
                    0 && (
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
                    setSelected(toggleArrayElement(selected, item))
                  }
                  selected={selected.includes(item)}
                  label={item}
                />
              )}
            />
          )}
        </Header>
      )}

      {optionsSelection.length > 0 && (
        <NoteOptions
          totalSelected={optionsSelection === filteredData}
          onTotalSelect={() =>
            setOptionsSelection(
              optionsSelection === filteredData ? [] : filteredData
            )
          }
          onDelete={() => {
            Alert.alert(
              "Alert",
              `Are you sure you want to delete permanently ${
                optionsSelection.length
              } ${optionsSelection.length === 1 ? "note" : "notes"}`,
              [
                { text: "Cencel", style: "cancel" },
                {
                  text: "Delete permanently",
                  onPress: () => {
                    setNotes((prev) => ({
                      data: excludeElemnts(prev.data, optionsSelection),
                    }));
                    setOptionsSelection([]);
                  },
                },
              ]
            );
          }}
          onClose={() => setOptionsSelection([])}
        />
      )}
      <FlatList
        columnWrapperStyle={{
          width: "100%",
          justifyContent: "center",
          gap: 12,
        }}
        numColumns={2}
        data={filteredData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <NoteCard
            options={optionsSelection.length > 0}
            selectedForOptions={optionsSelection.includes(item)}
            onLongPress={() =>
              setOptionsSelection(toggleArrayElement(optionsSelection, item))
            }
            onPress={() => {
              if (optionsSelection.length > 0) {
                setOptionsSelection(toggleArrayElement(optionsSelection, item));
              }
              if (optionsSelection.length === 0) {
                navigation.navigate("Edit-note", {
                  item,
                });
              }
            }}
            item={item}
          />
        )}
        scrollEventThrottle={16}
        onScroll={(e) =>
          scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y))
        }
        contentContainerStyle={{
          backgroundColor: theme.background,
          paddingHorizontal: 16,
          width: "100%",
          rowGap: 12,
          paddingBottom: 10,
          paddingTop:
            optionsSelection.length > 0 ? 100 + top : verticalScale(110) + top,
        }}
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      />
      <CreateIcon onPress={() => navigation.navigate("Create-note")} />
    </View>
  );
}
