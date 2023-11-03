import { PropsWithChildren } from "react";

export interface CreateNoteProps {
  screen: string;
  show: boolean;
  onHide: any;
  children?: PropsWithChildren<React.ReactNode>;
}
