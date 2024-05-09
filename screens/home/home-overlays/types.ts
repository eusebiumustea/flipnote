import { Dispatch, SetStateAction } from "react";
import { NotePreviewTypes } from "../../note";
import { NotesListProps } from "../notes-list/types";

export interface HomeOverlaysProps extends NotesListProps {
  onDeleteNotes?: () => void;
  searchFilter?: NotePreviewTypes[];
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  hidden?: boolean;
}
