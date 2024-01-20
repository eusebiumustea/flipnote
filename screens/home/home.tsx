import { useBackHandler } from "@react-native-community/hooks";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  View,
  useAnimatedValue,
} from "react-native";
import { Text } from "react-native-fast-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { CreateIcon } from "../../components/assets";
import { Header } from "../../components/header/header";
import { NoteCard } from "../../components/note-card";
import { useToast } from "../../components/toast";
import { NOTES_PATH } from "../../constants";
import { useTheme } from "../../hooks";
import { useLoading } from "../../hooks/use-loading-dialog";
import { useRequest } from "../../hooks/use-request";
import {
  moderateFontScale,
  moderateScale,
  removeArrayKeyDuplicates,
  toggleArrayElement,
  verticalScale,
} from "../../tools";
import { currentPosition, note, notesData } from "../note";
import { NoteOptions } from "./note-options/note-options";
import { FilterButton, FilterFavoritesButton } from "./notes-filter";

export function Home({ navigation }) {
  const [elementPosition, setElementPosition] = useRecoilState(currentPosition);
  const [selected, setSelected] = useState<string[]>([]);
  const { request } = useRequest();
  const [optionsSelection, setOptionsSelection] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const [modal, setModal] = useState(false);
  const theme = useTheme();
  const scrollY = useAnimatedValue(0);
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
      data.filter((e) => e.isFavorite === true).length === 0
    ) {
      setOptionsSelection([]);
    }
    if (filteredData.length === 0) {
      setOptionsSelection([]);
      setSelected([]);
    }
  }, [favorite, filteredData]);

  const loading = useLoading();
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
              FileSystem.readDirectoryAsync(NOTES_PATH)
                .then((files) => {
                  Promise.all(
                    files.map(async (file) => {
                      const content = await FileSystem.readAsStringAsync(
                        `${NOTES_PATH}/${file}`
                      );
                      const data: note = JSON.parse(content);
                      if (optionsSelection.includes(data.id)) {
                        await FileSystem.deleteAsync(`${NOTES_PATH}/${file}`, {
                          idempotent: true,
                        });
                        await Notifications.cancelScheduledNotificationAsync(
                          data.id.toString()
                        );
                      }
                    })
                  );
                  request();
                  console.log("re");
                  setOptionsSelection([]);
                })
                .catch((e) => console.log(e));
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
  const sortedData = filteredData.slice().sort((a, b) => b.id - a.id);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await request();
    setRefreshing(false);
  }, []);

  const activityIndicatorColors = [
    "orange",
    "red",
    "green",
    "blue",
    "brown",
    "teal",
    "chartreuse",
  ];
  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            progressViewOffset={verticalScale(115) + top}
            tintColor={
              Platform.OS === "ios" &&
              activityIndicatorColors[
                Math.floor(Math.random() * activityIndicatorColors.length)
              ]
            }
            colors={activityIndicatorColors}
            style={{ zIndex: 1 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        initialNumToRender={50}
        maxToRenderPerBatch={100}
        ref={scrollRef}
        columnWrapperStyle={{
          width: "100%",
          // justifyContent: "center",
          paddingHorizontal: 12,
          gap: 8,
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
        data={sortedData}
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
            onPress={({
              nativeEvent: { pageX, pageY, locationX, locationY },
            }) => {
              if (optionsSelection.length > 0) {
                setOptionsSelection(
                  toggleArrayElement(optionsSelection, item.id).sort()
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
        directionalLockEnabled
        getItemLayout={(data, index) => ({
          length: verticalScale(250),
          offset: verticalScale(250) * index,
          index,
        })}
        onScroll={(e) => {
          scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y));
        }}
        contentContainerStyle={{
          width: "100%",
          rowGap: 8,
          paddingBottom: verticalScale(125),
          paddingTop: verticalScale(115) + top,
        }}
        style={{
          flex: 1,
          backgroundColor: theme.primary,
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
              setOptionsSelection(filteredData.map((e) => e.id).sort());
            }
          }}
          onDelete={deleteNotes}
          onClose={() => {
            setOptionsSelection([]);
            scrollY.setValue(0);
          }}
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
                  onSelected={() =>
                    setSelected((prev) => toggleArrayElement(prev, item))
                  }
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
            navigation.navigate("note-init");
          }}
          // onPress={() => {
          //   recalculateId();
          //   request();
          // }}
        />
      )}
    </>
  );
}
