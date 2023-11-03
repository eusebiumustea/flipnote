import { PropsWithChildren } from "react";

export interface CreateNoteProps {
  show: boolean;
  children?: PropsWithChildren<React.ReactNode>;
}
export interface EditNoteProps {
  fromX?: number;
  fromY?: number;
  fromHeight?: number;
  fromWidth?: number;
  show: boolean;
  children?: PropsWithChildren<React.ReactNode>;
}
