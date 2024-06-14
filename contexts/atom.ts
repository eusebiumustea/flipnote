import { atom, selector } from "recoil";
import {
  NotePreviewTypes,
  NotificationProp,
  UserdataState,
} from "../screens/note/types";
export const EMPTY_NOTE_STATE: NotePreviewTypes = {
  id: 0,
  title: "",
  text: "",
  isFavorite: false,
  background: "#fff",
  reminder: null,
  imageOpacity: 0,
  contentPosition: "left",
};
export const notesValue = selector({
  key: "notesValue",
  get: ({ get }) => {
    return get(notesData)
      .data.slice()
      .sort((a, b) => b.id - a.id);
  },
});
export const notesIdentifiers = selector({
  key: "notesId",
  get: ({ get }) => {
    return get(notesData).data.map((e) => e.id.toString());
  },
});

export const notesData = atom<UserdataState>({
  key: "userdata",
  default: {
    loading: true,
    data: [],
    loaded: false,
  },
});

export const receivedNotifications = atom<NotificationProp[]>({
  key: "notifications",
  default: [],
});
