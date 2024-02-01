import { atom, selector } from "recoil";
import {
  ElementPositionTypes,
  NotePreviewTypes,
  NotificationProp,
  UserdataState,
  note,
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
export const notesValue = selector({
  key: "notesValue",
  get: ({ get }) => {
    return get(notesData)
      .slice()
      .sort((a, b) => b.id - a.id);
  },
});
export const elementCoordinatesValue = selector({
  key: "coordinatesValue",
  get: ({ get }) => {
    return get(currentElementCoordinates);
  },
});
export const notesData = atom<NotePreviewTypes[]>({
  key: "userdata",
  default: [],
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
