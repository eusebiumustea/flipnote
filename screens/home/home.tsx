import { useBackHandler } from "@react-native-community/hooks";
import * as Notifications from "expo-notifications";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, View, useAnimatedValue } from "react-native";
import { Text } from "react-native-fast-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { CreateIcon } from "../../components/assets";
import { Header } from "../../components/header/header";
import { NoteCard } from "../../components/note-card";
import { useToast } from "../../components/toast";
import { useTheme } from "../../hooks";
import {
  excludeNotes,
  moderateFontScale,
  moderateScale,
  removeArrayKeyDuplicates,
  toggleArrayElement,
  verticalScale,
} from "../../tools";
import { currentPosition, notesData } from "../note";
import { NoteOptions } from "./note-options/note-options";
import { FilterButton, FilterFavoritesButton } from "./notes-filter";
export function Home({ navigation }) {
  const [elementPosition, setElementPosition] = useRecoilState(currentPosition);
  const [selected, setSelected] = useState<string[]>([]);

  const [optionsSelection, setOptionsSelection] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const [modal, setModal] = useState(false);
  const theme = useTheme();
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top } = useSafeAreaInsets();
  const data = useMemo(() => {
    const searchFiltered = notes.data.filter((e) => {
      return (
        e.text.includes(searchQuery.toLowerCase()) ||
        e.title.includes(searchQuery.toLowerCase())
      );
    });
    if (searchQuery) {
      return searchFiltered;
    }
    return notes.data;
  }, [searchQuery, notes.data]);
  const filteredData = useMemo(() => {
    const newData = data.filter((e) => selected.includes(e.title));
    if (selected.length > 0) {
      return favorite ? newData.filter((e) => e.isFavorite === true) : newData;
    }
    return favorite ? data.filter((e) => e.isFavorite === true) : data;
  }, [data, selected, favorite]);
  const notesWithoutCopies = useMemo(() => {
    return removeArrayKeyDuplicates(data, "title");
  }, [data, selected]);
  useEffect(() => {
    if (filteredData.filter((e) => e.isFavorite === true).length === 0) {
      setFavorite(false);
    }
    if (
      optionsSelection.length > 0 &&
      favorite &&
      notes.data.filter((e) => e.isFavorite === true).length === 0
    ) {
      setOptionsSelection([]);
    }
    if (notes.data.length === 0) {
      setOptionsSelection([]);
    }
    if (filteredData.length === 0) {
      setSelected([]);
    }
  }, [notes.data, favorite, filteredData]);
  function deleteNotes() {
    const noteCount = optionsSelection.length;
    const plural = noteCount === 1 ? "" : "s";
    Alert.alert(
      "Confirm Deletion",
      `You're about to permanently delete ${noteCount} note${plural} and cencel their reminders. This action cannot be undone. Proceed?`,
      [
        { text: "Cencel", style: "cancel", onPress: () => null },
        {
          text: "Delete permanently",
          style: "destructive",
          onPress: () => {
            try {
              setNotes((prev) => ({
                ...prev,
                data: excludeNotes(prev.data, optionsSelection),
              }));
              optionsSelection.forEach(
                async (e) =>
                  await Notifications.cancelScheduledNotificationAsync(
                    e.toString()
                  )
              );
              setOptionsSelection([]);
            } catch (_) {
              toast({ message: "Can't delete notes", textColor: "red" });
            }
          },
        },
      ]
    );
  }
  const toast = useToast();
  const scrollRef = useRef<FlatList>(null);
  useBackHandler(() => {
    if (optionsSelection.length > 0) {
      setOptionsSelection([]);
      return true;
    }
    return false;
  });
  return (
    <>
      <FlatList
        initialNumToRender={50}
        maxToRenderPerBatch={100}
        ref={scrollRef}
        columnWrapperStyle={{
          width: "100%",
          justifyContent: "center",
          gap: 12,
        }}
        numColumns={2}
        ListEmptyComponent={
          <Text
            style={{
              alignSelf: "center",
              paddingVertical: 26,
              fontSize: moderateFontScale(20),
            }}
          >
            No data found
          </Text>
        }
        data={filteredData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <NoteCard
            options={optionsSelection.length > 0}
            selectedForOptions={optionsSelection.includes(item.id)}
            onLongPress={() =>
              setOptionsSelection(toggleArrayElement(optionsSelection, item.id))
            }
            onPress={({
              nativeEvent: { pageX, pageY, locationX, locationY },
            }) => {
              if (optionsSelection.length > 0) {
                setOptionsSelection(
                  toggleArrayElement(optionsSelection, item.id)
                );
              } else {
                setElementPosition({
                  relativeX: pageX - locationX,
                  relativeY: pageY - locationY,
                });
                navigation.navigate("note", { id: item.id });
              }
            }}
            item={item}
          />
        )}
        scrollEventThrottle={16}
        windowSize={50}
        getItemLayout={(data, index) => ({
          length: verticalScale(250),
          offset: verticalScale(250) * index,
          index,
        })}
        updateCellsBatchingPeriod={100}
        onScroll={(e) => {
          scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y));
        }}
        contentContainerStyle={{
          backgroundColor: theme.homeBackground,
          paddingHorizontal: 16,
          width: "100%",
          rowGap: 12,
          paddingBottom: 30,
          paddingTop: verticalScale(115) + top,
        }}
        style={{
          flex: 1,
          backgroundColor: theme.homeBackground,
        }}
      />

      {optionsSelection.length > 0 && (
        <NoteOptions
          selectedNotes={optionsSelection}
          onModalOpen={() => setModal(true)}
          onModalClose={() => setModal(false)}
          showModal={modal}
          totalSelected={optionsSelection.length === filteredData.length}
          onTotalSelect={() => {
            if (optionsSelection.length === filteredData.length) {
              setOptionsSelection([]);
            } else {
              setOptionsSelection(filteredData.map((e) => e.id));
            }
          }}
          onDelete={deleteNotes}
          onClose={() => setOptionsSelection([])}
        />
      )}
      {optionsSelection.length === 0 && (
        <Header
          children={
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
                  onSelected={() => {
                    if (selected.length + 1 === notes.data.length) {
                      setSelected([]);
                    } else {
                      setSelected((prev) => toggleArrayElement(prev, item));
                    }
                  }}
                  selected={selected.includes(item)}
                  label={item}
                />
              )}
            />
          }
          onInboxOpen={({
            nativeEvent: { pageX, pageY, locationX, locationY },
          }) => {
            setElementPosition({
              relativeX: pageX - locationX + 15,
              relativeY: pageY - locationY,
            });
            navigation.navigate("inbox");
          }}
          scrollY={scrollY}
          searchValue={searchQuery}
          onSearch={setSearchQuery}
          extraHeight={verticalScale(40)}
        />
      )}

      {optionsSelection.length === 0 && (
        <CreateIcon
          onPress={({
            nativeEvent: { pageX, pageY, locationX, locationY },
          }) => {
            setElementPosition({
              relativeX: pageX - locationX + moderateScale(45),
              relativeY: pageY - locationY + verticalScale(45),
            });
            navigation.navigate("note-init", { id: notes.data.length + 1 });
          }}
        />
      )}
    </>
  );
}
