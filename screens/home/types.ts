import { PropsWithChildren } from "react";
import { ColorValue } from "react-native";

export interface CreateNoteProps {
  show: boolean;
  children?: PropsWithChildren<React.ReactNode>;
}
export interface EditNoteProps {
  fromX?: number;
  fromY?: number;
  fromHeight?: number;
  fromWidth?: number;
  fromBg: ColorValue;
  show: boolean;
  children?: PropsWithChildren<React.ReactNode>;
}
