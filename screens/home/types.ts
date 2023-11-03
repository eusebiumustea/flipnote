import { PropsWithChildren } from "react";

export interface CreateNoteProps {
  show: boolean;
  onHide: any;
  children?: PropsWithChildren<React.ReactNode>;
}
