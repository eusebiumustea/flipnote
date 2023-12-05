import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, useEffect } from "react";
import { useRecoilState } from "recoil";
import { note, notesData } from "../../screens/note";
import { changeKeyValuesConditionaly, recalculateId } from "../../tools";
import * as Notifications from "expo-notifications";
import { useToast } from "../toast";
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
        // const id = JSON.parse(request.identifier);
        // console.log(typeof id);
        // const receivedReminder: note = notes.data.find((e) => e.id === id);
        // console.log(receivedReminder);
        // if (receivedReminder) {
        //   setNotes((prev) => ({
        //     ...prev,
        //     data: replaceElementAtId(prev.data, id, {
        //       ...receivedReminder,
        //       reminder: null,
        //     }),
        //   }));
        // }
      } catch (error) {}
    },
  });
  useEffect(() => {
    async function getData(key: string) {
      try {
        const res = await AsyncStorage.getItem(key);
        const notes = JSON.parse(res);
        if (notes) {
          setNotes({ data: recalculateId(notes) });
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
        console.log(e);
      }
    };
    storeData(notes.data);
  }, [notes]);

  return children;
}
