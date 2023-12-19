import { atom } from "recoil";
import { UserdataState } from "../types";
export const notesData = atom<UserdataState>({
  key: "userdata",
  default: {
    data: [],
  },
});
