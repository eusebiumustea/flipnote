import { atom } from "recoil";
import { NotificationProp, NotificationState, UserdataState } from "./types";
export const notesData = atom<UserdataState>({
  key: "userdata",
  default: {
    data: [],
  },
});
export const receivedNotifications = atom<NotificationState>({
  key: "notifications",
  default: {
    data: [],
  },
});
