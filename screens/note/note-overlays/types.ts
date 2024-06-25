import { Dispatch, SetStateAction } from "react";
import { Note, ReminderProps } from "../types";

export interface NoteOverlaysProps {
  id: number;
  editNote: Note;
  setEditNote: Dispatch<SetStateAction<Note>>;
  setReminder: Dispatch<SetStateAction<ReminderProps>>;
  reminder: ReminderProps;
  onReminderOpen: () => void;
  defaultContentTheme: string;
  reminderDialog: boolean;
  setReminderDialog: Dispatch<SetStateAction<boolean>>;
  shareImage: () => void;
  sharePdf: () => void;
  saveImage: () => void;
  savePdf: () => void;
  noteStateIsEmpty: boolean;
  textFiltered: string;
}
