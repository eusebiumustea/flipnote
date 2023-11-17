import { PropsWithChildren, ReactNode } from "react";

export interface DialogProps {
  action: () => void;
  visible: boolean;
  onCencel: () => void;
  title: string;
  children: PropsWithChildren<ReactNode>;
  actionLabel: string;
  animation?: "fade" | "none" | "slide";
  statusBarTranslucent?: boolean;
}
