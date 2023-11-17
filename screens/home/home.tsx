import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  View,
  useAnimatedValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import {
  CreateIcon,
  Header,
  Loading,
  NoteCard,
  useToast,
} from "../../components";
import {
  excludeElemnts,
  recalculateId,
  removeArrayKeyDuplicates,
  toggleArrayElement,
  useTheme,
  verticalScale,
} from "../../tools";
import * as Notifications from "expo-notifications";
import { notesData } from "../note";
import { NoteOptions } from "./note-options/note-options";
import { FilterButton, FilterFavoritesButton } from "./notes-filter";
export function Home({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [optionsSelection, setOptionsSelection] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top } = useSafeAreaInsets();
  const data = useMemo(() => {
    const searchFiltered = notes.data.filter(
      (e) =>
        e.text.includes(searchQuery.toLowerCase()) ||
        e.title.includes(searchQuery.toLowerCase())
    );
    if (searchQuery.length === 0) {
      return notes.data;
    }
    if (searchQuery.length > 0) {
      return searchFiltered;
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
  }, [notes.data, favorite, filteredData]);
  function deleteNotes() {
    const noteCount = optionsSelection.length;
    const plural = noteCount === 1 ? "" : "s";
    Alert.alert(
      "Confirm Deletion",
      `You're about to permanently delete ${noteCount} item${plural}. This action cannot be undone. Proceed?`,
      [
        { text: "Cencel", style: "cancel", onPress: () => {} },
        {
          text: "Delete permanently",
          style: "destructive",
          onPress: () => {
            try {
              setNotes((prev) => ({
                data: excludeElemnts(prev.data, optionsSelection),
              }));
              setNotes((prev) => ({
                data: recalculateId(prev.data),
              }));
              setOptionsSelection([]);
            } catch (error) {}
          },
        },
      ]
    );
  }
  const toast = useToast();
  async function registerNotifications() {
    let { status }: any = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      status = await Notifications.requestPermissionsAsync();
    }
    if (status !== "granted") {
      toast({ message: "Permission denied" });
      return;
    }
  }
  async function scheduleNotifications() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hello!",
        body: "This is a local notification!",
        data: { data: "goes here" },
      },
      trigger: { seconds: 10 },
    });
  }
  async function setupNotifications() {
    if (Platform.OS === "ios") {
      await registerNotifications();
    }
    await scheduleNotifications();
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: theme.background,
      }}
    >
      <Loading show={loading} />
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
          // textValue={password}
          // onChangeText={setPassword}
          selectedNotes={optionsSelection}
          onModalOpen={() => setModal(true)}
          onModalClose={() => {
            setModal(false);
            setPassword("");
          }}
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
                navigation.push("note", { id: item.id, edit: true });
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
          paddingTop: verticalScale(115) + top,
        }}
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      />
      <CreateIcon onPress={() => navigation.push("note")} />
    </View>
  );
}
