import { Dispatch, SetStateAction } from "react";
import { TextStyle } from "react-native";
export interface TextNoteStyle {
  interval?: InputSelectionProps;
  style?: TextStyle;
}
export interface ContentStyled {
  text: string;
  styles: TextStyle;
}
export type Content = string | ContentStyled[];
export interface ReminderProps {
  date: Date;
  time: Date;
}
export interface OptionProps {
  setEditNote?: Dispatch<SetStateAction<note>>;
  colors?: string[];
  editNote?: note;
  fonts?: string[];
  currentFocused?: TextNoteStyle;
  fontFamilyFocused?: string;
  currentIndex?: number;
  selection?: InputSelectionProps;
}
export interface ElementPositionTypes {
  relativeY: number;
  relativeX: number;
}
export interface note {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: string;
  styles: TextNoteStyle[];
  reminder: number | null;
  contentPosition: "center" | "left" | "right";
}
export interface NotePreviewTypes {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: string;
  reminder: number | null;
}
export interface InputSelectionProps {
  start: number;
  end: number;
}
export interface UserdataState {
  loading?: boolean;
  data: note[] | null;
}
export type NotificationProp = {
  title: string;
  content: string;
  time: Date;
};
export interface NotificationState {
  data: NotificationProp[];
}
export interface StyleEventProps {}
