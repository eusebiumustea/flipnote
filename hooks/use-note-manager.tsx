import { Dispatch, SetStateAction, useEffect } from "react";
import { UserdataState, note } from "../screens";
import { useToast } from "../components";
import { reinjectElementInArray, replaceElementAtId } from "../tools";

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
  const included = data.map((e) => e.id).includes(id);
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
