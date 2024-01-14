import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { UserdataState, note } from "../screens";
import { reinjectElementInArray, replaceElementAtId } from "../tools";
import { useToast } from "../components/toast";

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
  const included = useMemo(() => {
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
