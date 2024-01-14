import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { note, notesData } from "../screens/note";
import { changeKeyValuesConditionaly, recalculateId } from "../tools";
import { useToast } from "../components/toast";

export function AppStorageContext({ children }: PropsWithChildren) {
  const [notes, setNotes] = useRecoilState(notesData);
  const toast = useToast();

  Notifications.setNotificationHandler({
    handleError(_, error) {
      toast({ message: `${error.name}: ${error.message}`, textColor: "red" });
      setNotes((prev) => ({
        ...prev,
        data: changeKeyValuesConditionaly(
          prev.data,
          "reminder",
          "lower",
          new Date(),
          null
        ),
      }));
    },
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
    handleSuccess() {
      setNotes((prev) => ({
        ...prev,
        data: changeKeyValuesConditionaly(
          prev.data,
          "reminder",
          "lower",
          new Date(),
          null
        ),
      }));
    },
  });
  const dataUri = `${FileSystem.documentDirectory}data.json`;
  useEffect(() => {
    async function getData() {
      try {
        const data = await FileSystem.readAsStringAsync(dataUri);

        const notes = JSON.parse(data);
        if (notes) {
          setNotes((prev) => ({ ...prev, data: notes }));
        }
      } catch (e) {}
    }
    getData();
  }, []);
  useEffect(() => {
    const storeData = async (value: note[]) => {
      try {
        await FileSystem.writeAsStringAsync(dataUri, JSON.stringify(value));
      } catch (e) {
        toast({
          message: "Failed to save note in appdata!",
          textColor: "red",
        });
      }
    };
    storeData(notes.data);
  }, [notes.data]);

  return children;
}
