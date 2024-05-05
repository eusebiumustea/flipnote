import { NavigationProp, useNavigation } from "@react-navigation/native";
import { memo, useState } from "react";
import { CreateIcon } from "../../../components";
import { verticalScale } from "../../../utils";
import { NoteOptions } from "../note-options";
import { NotesFilterList } from "../notes-filter";
import { HomeOverlaysProps } from "./types";
import { Header } from "../../../components/header";

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
            onInboxOpen={() => {
              if (navigation.isFocused()) {
                navigation.navigate("inbox");
              }
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
              if (navigation.isFocused()) {
                navigation.navigate("note-init", {
                  id: new Date().getTime(),
                  relativeX: pageX - locationX,
                  relativeY: pageY - locationY,
                });
              }
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
