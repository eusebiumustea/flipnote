import { NavigationProp, useNavigation } from "@react-navigation/native";
import { memo, useState } from "react";
import { CreateIcon } from "../../../components";
import { Header } from "../../../components/header/header";
import { NoteOptions } from "../note-options";
import { HomeOverlaysProps } from "./types";

export const HomeOverlays = memo(
  ({
    optionsSelection,
    setOptionsSelection,
    data,
    onDeleteNotes,
    scrollY,
    searchQuery,
    setSearchQuery,
  }: HomeOverlaysProps) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [sharingDialog, setSharingDialog] = useState(false);
    if (optionsSelection.length === 0) {
      return (
        <>
          <Header
            onInboxOpen={() => {
              if (navigation.isFocused()) {
                navigation.navigate("inbox");
              }
            }}
            scrollY={scrollY}
            searchValue={searchQuery}
            onSearch={setSearchQuery}
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
                  isCreating: true,
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
