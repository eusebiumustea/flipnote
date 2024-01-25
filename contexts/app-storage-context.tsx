import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useToast } from "../components/toast";
import { useRequest } from "../hooks/use-request";
import { notesData } from "../screens/note";
import { changeKeyValuesConditionaly } from "../tools";

export function AppStorageContext({ children }: PropsWithChildren) {
  const [notes, setNotes] = useRecoilState(notesData);
  const toast = useToast();

  const { request } = useRequest();
  useEffect(() => {
    async function getUserData() {
      setNotes((prev) => ({ ...prev, loading: true }));
      await request();
      setNotes((prev) => ({ ...prev, loading: false }));
    }
    getUserData();
  }, []);

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

  return children;
}
