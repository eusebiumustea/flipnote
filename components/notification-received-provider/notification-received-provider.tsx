import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect } from "react";
import { useRecoilState } from "recoil";
import { notesData } from "../../screens";
import { changeKeyValuesConditionaly } from "../../tools";

export function NotificationReceivedProvider({ children }: PropsWithChildren) {
  const [notes, setNotes] = useRecoilState(notesData);
  useEffect(() => {
    const subscribe = Notifications.addNotificationReceivedListener(
      ({ request }) => {
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
      }
    );
    return () => subscribe.remove();
  }, []);

  return children;
}
