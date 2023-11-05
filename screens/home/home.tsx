import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { FlatList, useAnimatedValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { CreateIcon } from "../../components/assets";
import { Header } from "../../components/header";
import { NoteCard } from "../../components/note-card";
import { useTheme, verticalScale } from "../../tools";
import { notesData } from "../note";
export function Home() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useRecoilState(notesData);
  const filteredData = useMemo(() => {
    if (searchQuery.length > 0) {
      return notes.data.filter(
        (e) =>
          e.text.includes(searchQuery.toLowerCase()) ||
          e.title.includes(searchQuery.toLowerCase())
      );
    } else {
      return notes.data;
    }
  }, [searchQuery, notes]);
  return (
    <>
      <Header
        scrollY={scrollY}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
      />
      <FlatList
        columnWrapperStyle={{
          width: "100%",
          justifyContent: "center",
          columnGap: 20,
        }}
        numColumns={2}
        data={filteredData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(itemData) => (
          <NoteCard
            onPress={() =>
              navigation.navigate("Edit-note", {
                item: itemData?.item,
                currentItem: itemData?.index,
              })
            }
            item={itemData.item}
            key={itemData.index}
          />
        )}
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y));
        }}
        contentContainerStyle={{
          paddingTop: top + verticalScale(76),
          backgroundColor: theme.background,
          padding: 16,
          width: "100%",
          rowGap: 20,
        }}
        style={{ flex: 1, backgroundColor: theme.background }}
      />
      <CreateIcon onPress={() => navigation.navigate("Create-note")} />
    </>
  );
}
