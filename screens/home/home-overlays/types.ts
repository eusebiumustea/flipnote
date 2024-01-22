import { Dispatch, SetStateAction } from "react";
import { note } from "../../note";
import { NotesListProps } from "../notes-list/types";

export interface HomeOverlaysProps extends NotesListProps {
  onDeleteNotes?: () => void;
  selected?: string[];
  setSelected?: Dispatch<SetStateAction<string[]>>;
  searchFilter?: note[];
  favorite?: boolean;
  setFavorite?: Dispatch<SetStateAction<boolean>>;
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
}
