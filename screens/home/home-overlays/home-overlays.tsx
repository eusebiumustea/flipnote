import { NavigationProp, useNavigation } from "@react-navigation/native";
import { memo, useState } from "react";
import { CreateIcon, Header } from "../../../components";
import { moderateScale, verticalScale } from "../../../tools";
import { NoteOptions } from "../note-options";
import { NotesFilterList } from "../notes-filter";
import { HomeOverlaysProps } from "./types";

export const HomeOverlays = memo(
  ({
    optionsSelection,
    setOptionsSelection,
    data,
    onDeleteNotes,
    scrollY,
    selected,
    setSelected,
    searchFilter,
    favorite,
    setFavorite,
    searchQuery,
    setSearchQuery,
    setElementPosition,
  }: HomeOverlaysProps) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [sharingDialog, setSharingDialog] = useState(false);
    if (optionsSelection.length === 0) {
      return (
        <>
          <Header
            children={
              <NotesFilterList
                setFavorite={setFavorite}
                searchFilter={searchFilter}
                selected={selected}
                data={data}
                favorite={favorite}
                setSelected={setSelected}
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
          />
        </>
      );
    }
    return (
      <NoteOptions
        selectedNotes={optionsSelection}
        onModalOpen={() => setSharingDialog(true)}
        onModalClose={() => setSharingDialog(false)}
        showModal={sharingDialog}
        totalSelected={optionsSelection.length === data.length}
        onTotalSelect={() => {
          if (optionsSelection.length === data.length) {
            setOptionsSelection([]);
          } else {
            setOptionsSelection(data.map((e) => e.id).sort());
          }
        }}
        onDelete={onDeleteNotes}
        onClose={() => {
          setOptionsSelection([]);
          scrollY.setValue(0);
        }}
      />
    );
  }
);
