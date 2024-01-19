import * as FileSystem from "expo-file-system";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useToast } from "../components/toast";
import { NOTES_PATH } from "../constants";
import { UserdataState, note } from "../screens";
import { reinjectElementInArray, replaceElementAtId } from "../tools";
export function useStoreNote(id: number, state: note) {
  const toast = useToast();

  return useEffect(() => {
    async function storeDataConditional() {
      const fileName = `${id}.json`;
      const notePath = `${NOTES_PATH}/${fileName}`;

      const { exists } = await FileSystem.getInfoAsync(notePath);

      const noteStateIsEmpty =
        state.text.length === 0 && state.title.length === 0;

      try {
        if (noteStateIsEmpty) {
          await FileSystem.deleteAsync(notePath, { idempotent: true }).then(
            () => {
              console.log("deleted", id);
            }
          );
        }
        if (!noteStateIsEmpty && exists) {
          await FileSystem.writeAsStringAsync(
            notePath,
            JSON.stringify(state)
          ).then((e) => console.log("edited", id));
        }
        if (!noteStateIsEmpty && !exists) {
          await FileSystem.writeAsStringAsync(
            notePath,
            JSON.stringify(state)
          ).then((e) => console.log("created", id));
        }
      } catch (message) {
        toast({ message: "Failed to save note", textColor: "red" });
      }
    }
    storeDataConditional();
  }, [state]);
}

export function useNoteManager(
  setNotes: Dispatch<SetStateAction<UserdataState>>,
  state: note,
  data: note[],
  id: number
) {
  const edit: boolean = id < data.length + 1;
  const noteStateIsEmpty = state.text.length === 0 && state.title.length === 0;
  const isEditing = edit && !noteStateIsEmpty;
  const isCreating = !edit && !noteStateIsEmpty;
  const included = useMemo(async () => {
    return data.map((e) => e.id).includes(id);
  }, [data]);
  const toast = useToast();

  return useEffect(() => {
    try {
      if (noteStateIsEmpty) {
        setNotes((prev) => ({
          ...prev,
          data: prev.data.filter((e) => e.id !== id),
        }));
      }
      if (isCreating && !included) {
        setNotes((prev) => ({
          ...prev,
          data: [...prev.data, state],
        }));
      }
      if (isCreating && included) {
        setNotes((prev) => ({
          ...prev,
          data: replaceElementAtId(prev.data, id, state),
        }));
      }
      if (isEditing && included) {
        setNotes((prev) => ({
          ...prev,
          data: replaceElementAtId(prev.data, id, state),
        }));
      }
      if (isEditing && !included) {
        setNotes((prev) => ({
          ...prev,
          data: reinjectElementInArray(prev.data, state),
        }));
      }
    } catch (message) {
      toast({ message: "Failed to save note", textColor: "red" });
    }
  }, [state, included]);
}
