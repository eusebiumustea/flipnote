import {
  FlatList,
  Platform,
  RefreshControl,
  useAnimatedValue,
  Text,
} from "react-native";
import {
  moderateFontScale,
  toggleArrayElement,
  verticalScale,
} from "../../../tools";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { memo, useCallback, useRef, useState } from "react";
import { useRequest } from "../../../hooks/use-request";
import { NoteCard } from "../../../components";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { currentElementCoordinates } from "../../note";
import { useRecoilState } from "recoil";
import { useTheme } from "../../../hooks";
import { NotesListProps } from "./types";

export const NotesList = memo(
  ({
    data,
    optionsSelection,
    setOptionsSelection,
    scrollY,
    setElementPosition,
  }: NotesListProps) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const theme = useTheme();

    const { request } = useRequest();
    const scrollRef = useRef<FlatList>(null);

    const { top } = useSafeAreaInsets();
    const sortedData = data.slice().sort((a, b) => b.id - a.id);
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
    );
  }
);
