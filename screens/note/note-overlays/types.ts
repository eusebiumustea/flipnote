import { Dispatch, SetStateAction } from "react";
import {
  InputSelectionProps,
  ReminderProps,
  TextNoteStyle,
  note,
} from "../types";

export interface NoteOverlaysProps {
  id: number;
  editNote: note;
  setEditNote: Dispatch<SetStateAction<note>>;
  setReminder: Dispatch<SetStateAction<ReminderProps>>;
  reminder: ReminderProps;
  onReminderOpen: () => void;

  currentSelectedStyle: TextNoteStyle;
  reminderDialog: boolean;
  setReminderDialog: Dispatch<SetStateAction<boolean>>;
  selection: InputSelectionProps;

  shareImage: () => Promise<void>;
  sharePdf: () => Promise<void>;
}
export interface NoteOverlaysPreStylingProps {
  id: number;
  editNote: note;
  setEditNote: Dispatch<SetStateAction<note>>;
  setReminder: Dispatch<SetStateAction<ReminderProps>>;
  reminder: ReminderProps;
  onReminderOpen: () => void;
  onShare: () => void;
  currentSelectedStyle: TextNoteStyle;
  reminderDialog: boolean;
  setReminderDialog: Dispatch<SetStateAction<boolean>>;
  selection: InputSelectionProps;
}
