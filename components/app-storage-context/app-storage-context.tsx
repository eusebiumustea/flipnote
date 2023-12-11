import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect } from "react";
import { useRecoilState } from "recoil";
import { note, notesData } from "../../screens/note";
import { changeKeyValuesConditionaly, recalculateId } from "../../tools";
import { useToast } from "../toast";
import { useLoading } from "../loading-dialog";
export function AppStorageContext({ children }: PropsWithChildren) {
  const [notes, setNotes] = useRecoilState(notesData);
  const toast = useToast();
  const loading = useLoading();
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
      try {
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
      } catch (error) {}
    },
  });
  useEffect(() => {
    async function getData(key: string) {
      loading(true);
      try {
        const res = await AsyncStorage.getItem(key);
        const notes = JSON.parse(res);
        if (notes) {
          setNotes({ data: recalculateId(notes) });
          loading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getData("appdata");
  }, []);
  useEffect(() => {
    const storeData = async (value: note[]) => {
      try {
        await AsyncStorage.setItem("appdata", JSON.stringify(value));
      } catch (e) {
        toast({
          message: "Failed to save note in appdata!",
          textColor: "red",
        });
      }
    };

    storeData(notes.data);
  }, [notes]);

  return children;
}
