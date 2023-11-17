import { ColorValue, TextStyle } from "react-native";
interface TextNoteStyle {
  interval: InputSelectionProps;
  style: TextStyle;
}
export interface note {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: string;
  styles: TextNoteStyle[];
}
export interface InputSelectionProps {
  start: number;
  end: number;
}
export interface UserdataState {
  data: note[];
}
