import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  View,
  useAnimatedValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { CreateIcon } from "../../components/assets";
import { Header } from "../../components/header";
import { NoteCard } from "../../components/note-card";
import { useTheme, verticalScale } from "../../tools";
import { NotePage, notesData } from "../note";
import { CreateNoteContainer } from "./create-note-container";
import { EditNoteContainer } from "./edit-note-container";
import { NotePageEdit } from "../note/note-page-edit";
export function Home() {
  const cardsLayout = useRef<any[]>([]).current;
  const theme = useTheme();
  const { height, width } = Dimensions.get("window");
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [createNote, setCreateNote] = useState(false);
  const [editNote, setEditNote] = useState<number | null>(null);
  const [data, setData] = useRecoilState(notesData);
  useMemo(() => {
    async function getData(key: any) {
      try {
        const res = await AsyncStorage.getItem(key);
        const data = JSON.parse(res);
        setData({ loading: true, data: [] });
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
    } else {
      return data.data;
    }
  }, [searchQuery, data]);
  return (
    <>
      <Header
        scrollY={scrollY}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
      />
      <EditNoteContainer
        fromBg={filteredData[editNote]?.cardColor}
        fromWidth={cardsLayout[editNote]?.width}
        fromHeight={cardsLayout[editNote]?.height}
        fromY={cardsLayout[editNote]?.y}
        fromX={cardsLayout[editNote]?.x}
        show={editNote !== null}
      >
        {filteredData.map((item, i) => (
          <NotePageEdit
            key={item.id}
            item={item}
            currentItem={i}
            onAnimationClose={() => setEditNote(null)}
            open={editNote === i}
          />
        ))}
      </EditNoteContainer>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollY.setValue(Math.max(0, e.nativeEvent.contentOffset.y));
        }}
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
            justifyContent: "flex-start",
            gap: 20,
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {filteredData.map((item, i) => (
            <NoteCard
              onLayout={(e: any) => {
                try {
                  if (filteredData) {
                    cardsLayout[i] = {
                      x: e.nativeEvent.layout.x,
                      y: e.nativeEvent.layout.y,
                      width: e.nativeEvent.layout.width,
                      height: e.nativeEvent.layout.height,
                    };
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
              onPress={() => setEditNote(i)}
              item={item}
              key={item.id}
            />
          ))}
        </View>
      </ScrollView>

      {!createNote && <CreateIcon onPress={() => setCreateNote(true)} />}
      <CreateNoteContainer show={createNote}>
        <NotePage open={createNote} onBack={() => setCreateNote(false)} />
      </CreateNoteContainer>
    </>
  );
}
