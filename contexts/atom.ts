import { atom } from "recoil";
import {
  ElementPositionTypes,
  NotificationProp,
  UserdataState,
} from "../screens/note/types";
export const EMPTY_NOTE_STATE = {
  id: 0,
  title: "",
  text: "",
  isFavorite: false,
  background: "#fff",
  styles: [],
  reminder: null,
};
export const notesData = atom<UserdataState>({
  key: "userdata",
  default: {
    loading: false,
    data: [],
  },
});
export const BackgroundImages = atom<string[]>({
  key: "background-images",
  default: [],
});
export const receivedNotifications = atom<NotificationProp[]>({
  key: "notifications",
  default: [],
});
export const currentElementCoordinates = atom<ElementPositionTypes>({
  key: "currentElementCoords",
  default: {
    relativeX: 0,
    relativeY: 0,
  },
});
