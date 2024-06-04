import { atom, selector } from "recoil";
import { NotePreviewTypes, NotificationProp } from "../screens/note/types";
export const EMPTY_NOTE_STATE = {
  id: 0,
  title: "",
  text: "",
  isFavorite: false,
  background: "#fff",
  styles: [],
  reminder: null,
  imageOpacity: 0,
};
export const notesValue = selector({
  key: "notesValue",
  get: ({ get }) => {
    return get(notesData)
      .slice()
      .sort((a, b) => b.id - a.id);
  },
});

export const notesData = atom<NotePreviewTypes[]>({
  key: "userdata",
  default: [],
});

export const receivedNotifications = atom<NotificationProp[]>({
  key: "notifications",
  default: [],
});
