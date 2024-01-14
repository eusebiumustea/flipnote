import { atom } from "recoil";
import {
  ElementPositionTypes,
  NotificationProp,
  UserdataState,
} from "../screens/note/types";
export const notesData = atom<UserdataState>({
  key: "userdata",
  default: {
    data: [],
  },
});
export const receivedNotifications = atom<NotificationProp[]>({
  key: "notifications",
  default: [],
});
export const currentPosition = atom<ElementPositionTypes>({
  key: "currentElementCoords",
  default: {
    relativeX: 0,
    relativeY: 0,
  },
});
