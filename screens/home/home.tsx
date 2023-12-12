import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { MotiView } from "moti";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  View,
  useAnimatedValue,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { CreateIcon, Header, NoteCard, useToast } from "../../components";
import {
  deviceIsLowRam,
  excludeElemnts,
  recalculateId,
  removeArrayKeyDuplicates,
  toggleArrayElement,
  useTheme,
  verticalScale,
} from "../../tools";
import { Inbox } from "../inbox";
import { notesData } from "../note";
import { NoteOptions } from "./note-options/note-options";
import { FilterButton, FilterFavoritesButton } from "./notes-filter";
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
        { text: "Cencel", style: "cancel", onPress: () => {} },
        {
          text: "Delete permanently",
          style: "destructive",
          onPress: () => {
            setDeleteProgress(optionsSelection);
            try {
              setTimeout(() => {
                setNotes((prev) => ({
                  ...prev,
                  data: excludeElemnts(prev.data, optionsSelection),
                }));
                setNotes((prev) => ({
                  ...prev,
                  data: recalculateId(prev.data),
                }));
                optionsSelection.map(async (e) => {
                  await Notifications.cancelScheduledNotificationAsync(
                    e.toString()
                  );
                });
                setOptionsSelection([]);
                setDeleteProgress([]);
              }, optionsSelection.length * 200);
            } catch (message) {
              toast({ message });
            }
          },
        },
      ]
    );
  }
  const toast = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <MotiView
        transition={{
          type: "timing",
          duration: 350,
          easing: Easing.inOut(Easing.ease),
        }}
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: theme.background,
        }}
        from={{ scale: 1 }}
        animate={{ scale: !deviceIsLowRam && inbox ? 0.9 : 1 }}
      >
        <Inbox onBack={() => setInbox(false)} open={inbox} />
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
                    onSelected={() =>
                      setSelected(toggleArrayElement(selected, item))
                    }
                    selected={selected.includes(item)}
                    label={item}
                  />
                )}
              />
            }
            inboxOpened={inbox}
            onInboxOpen={() => setInbox(true)}
            scrollY={scrollY}
            searchValue={searchQuery}
            onSearch={setSearchQuery}
            extraHeight={optionsSelection.length === 0 && verticalScale(40)}
          />
        )}

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
                setOptionsSelection(filteredData.map((e) => e.id).sort());
              }
            }}
            onDelete={deleteNotes}
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
              deletedProgress={deleteProgress.includes(item.id)}
              options={optionsSelection.length > 0}
              selectedForOptions={optionsSelection.includes(item.id)}
              onLongPress={() =>
                setOptionsSelection(
                  toggleArrayElement(optionsSelection, item.id).sort()
                )
              }
              onPress={() => {
                if (optionsSelection.length > 0) {
                  setOptionsSelection(
                    toggleArrayElement(optionsSelection, item.id).sort()
                  );
                } else if (optionsSelection.length === 0) {
                  navigation.push("note", { id: item.id });
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
            paddingBottom: 30,
            paddingTop: verticalScale(115) + top,
          }}
          style={{
            flex: 1,
            backgroundColor: theme.background,
          }}
        />
        <CreateIcon onPress={() => navigation.push("note")} />
      </MotiView>
    </View>
  );
}
