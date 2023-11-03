import { useState } from "react";
import { Dimensions, ScrollView, useAnimatedValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateIcon } from "../../components/assets";
import { Header } from "../../components/header";
import { useTheme, verticalScale } from "../../tools";
import { CreateNoteContainer } from "./create-note-container";
import { NotePage } from "../note";
export function Home() {
  const theme = useTheme();
  const scrollY = useAnimatedValue(0, { useNativeDriver: true });
  const { top, bottom } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [aninmation, setAnimation] = useState(false);
  const { height, width } = Dimensions.get("window");

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
        contentContainerStyle={{ paddingTop: top + verticalScale(60) }}
        style={{ flex: 1, backgroundColor: theme.background }}
      ></ScrollView>
      <CreateIcon onPress={() => setAnimation(true)} />
      <CreateNoteContainer
        screen="inbox"
        show={aninmation}
        onHide={() => setAnimation(false)}
      >
        <NotePage onBack={() => setAnimation(false)} />
      </CreateNoteContainer>
    </>
  );
}
