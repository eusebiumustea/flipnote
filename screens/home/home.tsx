import { useBackHandler } from "@react-native-community/hooks";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { AnimatePresence } from "moti";
import { MotiPressable } from "moti/interactions";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  View,
  useAnimatedValue,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { CreateIcon, NoteCard, useToast } from "../../components";
import { useTheme } from "../../hooks";
import {
  excludeNotes,
  removeArrayKeyDuplicates,
  toggleArrayElement,
  verticalScale,
} from "../../tools";
import { Inbox } from "../inbox";
import { notesData } from "../note";
import { NoteOptions } from "./note-options/note-options";
import { FilterButton, FilterFavoritesButton } from "./notes-filter";
import { Header } from "../../components/header/header";
export function Home() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<string[]>([]);
  const [inbox, setInbox] = useState(false);
  const [optionsSelection, setOptionsSelection] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const [modal, setModal] = useState(false);
  const theme = useTheme();
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top } = useSafeAreaInsets();
  const [deleteProgress, setDeleteProgress] = useState([]);
  const searchFilter = useMemo(() => {
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
  const filteredSelection = useMemo(() => {
    const selectedNotes = searchFilter.filter((e) =>
      selected.includes(e.title)
    );

    if (selected.length > 0) {
      return selectedNotes;
    }
    return searchFilter;
  }, [searchFilter, selected]);
  const filteredData = useMemo(() => {
    if (favorite) {
      return filteredSelection.filter((note) => note.isFavorite);
    }
    return filteredSelection;
  }, [favorite, filteredSelection]);
  const notesWithoutCopies = useMemo(() => {
    return removeArrayKeyDuplicates(filteredSelection, "title");
  }, [filteredSelection, selected]);
  useEffect(() => {
    if (filteredData.filter((e) => e.isFavorite === true).length === 0) {
      setFavorite(false);
    }
    if (
      optionsSelection.length > 0 &&
      favorite &&
      searchFilter.filter((e) => e.isFavorite === true).length === 0
    ) {
      setOptionsSelection([]);
    }
    if (searchFilter.length === 0) {
      setOptionsSelection([]);
    }
    if (filteredData.length === 0) {
      setSelected([]);
    }
  }, [favorite, filteredData]);
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
              setDeleteProgress(optionsSelection);
              setTimeout(() => {
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
                setDeleteProgress([]);
              }, optionsSelection.length * 300);
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

  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <Inbox onBack={() => setInbox(false)} open={inbox} />

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

      <Header
        show={optionsSelection.length === 0}
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
                onSelected={() =>
                  setSelected(toggleArrayElement(selected, item))
                }
                selected={selected.includes(item)}
                label={item}
              />
            )}
          />
        }
        onInboxOpen={() => setInbox(true)}
        scrollY={scrollY}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        extraHeight={optionsSelection.length === 0 && verticalScale(40)}
      />

      <FlatList
        ref={scrollRef}
        columnWrapperStyle={{
          width: "100%",
          justifyContent: "center",
          gap: 12,
        }}
        numColumns={2}
        data={filteredData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <NoteCard
            deletedProgress={deleteProgress.includes(item.id)}
            options={optionsSelection.length > 0}
            selectedForOptions={optionsSelection.includes(item.id)}
            onLongPress={() =>
              setOptionsSelection(toggleArrayElement(optionsSelection, item.id))
            }
            onPress={() => {
              if (optionsSelection.length > 0) {
                setOptionsSelection(
                  toggleArrayElement(optionsSelection, item.id)
                );
                return;
              }
              navigation.navigate("note", { id: item.id });
            }}
            item={item}
          />
        )}
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y));
        }}
        contentContainerStyle={{
          backgroundColor: theme.background,
          paddingHorizontal: 16,
          width: "100%",
          rowGap: 12,
          paddingBottom: 30,
          paddingTop: verticalScale(115) + top,
        }}
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      />

      {optionsSelection.length === 0 && (
        <CreateIcon onPress={() => navigation.push("note")} />
      )}
    </View>
  );
}
