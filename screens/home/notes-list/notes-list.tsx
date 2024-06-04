import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { memo, useCallback, useRef, useState } from "react";
import { FlatList, Platform, RefreshControl, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteCard } from "../../../components";
import { useTheme } from "../../../hooks";
import { useRequest } from "../../../hooks/use-request";
import {
  moderateFontScale,
  toggleArrayElement,
  verticalScale,
} from "../../../utils";
import { NotesFilterList } from "../notes-filter/notes-filter-list";
import { NotesListProps } from "./types";

export const NotesList = memo(
  ({
    data,
    optionsSelection,
    setOptionsSelection,
    selected,
    setSelected,
    searchFilter,
    favorite,
    setFavorite,
    scrollY,
  }: NotesListProps) => {
    const navigation = useNavigation<StackNavigationHelpers>();
    const theme = useTheme();
    const scrollRef = useRef<FlatList>(null);
    const { top } = useSafeAreaInsets();
    const { syncState } = useRequest();
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await syncState();
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
              progressViewOffset={verticalScale(70) + top}
              tintColor={
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
          ref={scrollRef}
          ListHeaderComponent={
            <NotesFilterList
              setFavorite={setFavorite}
              searchFilter={searchFilter}
              selected={selected}
              data={data}
              hidden={optionsSelection.length > 0}
              favorite={favorite}
              setSelected={setSelected}
            />
          }
          columnWrapperStyle={{
            width: "100%",
            justifyContent: "center",
            paddingHorizontal: 12,
            gap: 12,
          }}
          numColumns={2}
          ListEmptyComponent={
            <Text
              style={{
                alignSelf: "center",
                paddingVertical: 26,
                fontSize: moderateFontScale(20),
                color: theme.onPrimary,
              }}
            >
              Press + to start
            </Text>
          }
          data={data}
          scrollEnabled={navigation.isFocused()}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <NoteCard
              options={optionsSelection.length > 0}
              selectedForOptions={optionsSelection.includes(item.id)}
              onLongPress={() =>
                setOptionsSelection(
                  toggleArrayElement(optionsSelection, item.id)
                )
              }
              onPress={({
                nativeEvent: { pageX, pageY, locationX, locationY },
              }) => {
                if (optionsSelection.length > 0) {
                  setOptionsSelection(
                    toggleArrayElement(optionsSelection, item.id)
                  );
                  return;
                }
                if (navigation.isFocused()) {
                  navigation.navigate("note", {
                    id: item.id,
                    relativeX: pageX - locationX,
                    relativeY: pageY - locationY,
                    background: item.background,
                    isCreating: false,
                  });
                }
              }}
              item={item}
            />
          )}
          scrollEventThrottle={16}
          initialNumToRender={6}
          keyboardDismissMode="on-drag"
          updateCellsBatchingPeriod={300}
          getItemLayout={(data, index) => ({
            length: verticalScale(250),
            offset: verticalScale(250) * index,
            index,
          })}
          maxToRenderPerBatch={6}
          onScroll={(e) => {
            scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y));
          }}
          contentContainerStyle={{
            width: "100%",
            rowGap: 12,
            paddingBottom: 16,
            paddingTop: verticalScale(70) + top,
          }}
          style={{
            flex: 1,
            backgroundColor: theme.primary,
          }}
        />
      </>
    );
  }
);
