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
import { NotesListProps } from "./types";

export const NotesList = memo(
  ({
    data,
    optionsSelection,
    setOptionsSelection,
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
          ref={scrollRef}
          columnWrapperStyle={{
            width: "100%",
            justifyContent: "center",
            paddingHorizontal: 12,
            gap: 12,
          }}
          numColumns={2}
          renderToHardwareTextureAndroid
          ListEmptyComponent={
            <Text
              style={{
                alignSelf: "center",
                paddingVertical: 26,
                fontSize: moderateFontScale(20),
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
                  });
                }
              }}
              item={item}
            />
          )}
          scrollEventThrottle={16}
          initialNumToRender={6}
          keyboardDismissMode="interactive"
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
            paddingTop: verticalScale(115) + top,
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
