import { ColorValue } from "react-native";

export interface note {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: ColorValue | string;
}
export interface userdataState {
  data: note[];
}
