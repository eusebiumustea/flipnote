import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View, useAnimatedValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { CreateIcon } from "../../components/assets";
import { Header } from "../../components/header";
import { NoteCard } from "../../components/note-card";
import { useTheme, verticalScale } from "../../tools";
import { NotePage, notesData } from "../note";
import { CreateNoteContainer } from "./create-note-container";
export function Home() {
  const theme = useTheme();
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [createNote, setCreateNote] = useState(false);
  const [data, setData] = useRecoilState(notesData);

  useEffect(() => {
    async function getData(key: any) {
      try {
        const res = await AsyncStorage.getItem(key);
        const data = JSON.parse(res);
        if (data) {
          setData({ loading: false, data: data });
        }
      } catch (e) {
        console.log(e);
      }
    }
    getData("userdata");
  }, []);
  const filteredData = useMemo(() => {
    if (searchQuery.length > 0) {
      return data.data.filter(
        (e) => e.text.includes(searchQuery) || e.title.includes(searchQuery)
      );
    }
    return data.data;
  }, [searchQuery, data]);
  return (
    <>
      <Header
        scrollY={scrollY}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
      />
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(e) =>
          scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y))
        }
        contentContainerStyle={{
          paddingTop: top + verticalScale(60),
          backgroundColor: theme.background,
        }}
        style={{ flex: 1, backgroundColor: theme.background }}
      >
        <View
          style={{
            width: "100%",
            padding: 16,
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {filteredData.map((item, i) => (
            <NoteCard
              onPress={() => console.log(JSON.stringify(item))}
              item={item}
              key={i}
            />
          ))}
        </View>
      </ScrollView>

      {!createNote && <CreateIcon onPress={() => setCreateNote(true)} />}
      <CreateNoteContainer
        show={createNote}
        onHide={() => setCreateNote(false)}
      >
        <NotePage onBack={() => setCreateNote(false)} />
      </CreateNoteContainer>
    </>
  );
}
