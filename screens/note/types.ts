import { ColorValue } from "react-native";

export interface note {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  cardColor: ColorValue;
}
export interface userdataState {
  data: note[];
  loading: boolean;
}
