import { ColorValue, TextStyle } from "react-native";
interface TextNoteStyle {
  interval: InputSelectionProps;
  style: TextStyle;
}
export interface ReminderProps {
  date: Date;
  time: Date;
}
export interface note {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: string;
  styles: TextNoteStyle[];
  reminder: number | null;
}
export interface InputSelectionProps {
  start: number;
  end: number;
}
export interface UserdataState {
  data: note[];
}
