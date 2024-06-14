import { Dispatch, SetStateAction } from "react";
import {
  InputSelectionProps,
  Note,
  ReminderProps,
  TextNoteStyle,
} from "../types";

export interface NoteOverlaysProps {
  id: number;
  editNote: Note;
  setEditNote: Dispatch<SetStateAction<Note>>;
  setReminder: Dispatch<SetStateAction<ReminderProps>>;
  reminder: ReminderProps;
  onReminderOpen: () => void;
  defaultContentTheme: string;
  currentSelectedStyle: TextNoteStyle;
  reminderDialog: boolean;
  setReminderDialog: Dispatch<SetStateAction<boolean>>;
  selection: InputSelectionProps;
  shareImage: () => Promise<void>;
  sharePdf: () => Promise<void>;
  saveImage: () => Promise<void>;
  savePdf: () => Promise<void>;
}
