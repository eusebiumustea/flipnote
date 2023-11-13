import { atom } from "recoil";
import { userdataState } from "./types";
export const notesData = atom<userdataState>({
  key: "userdata",
  default: {
    data: [],
  },
});
