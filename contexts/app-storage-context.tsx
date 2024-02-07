import { getInfoAsync, makeDirectoryAsync } from "expo-file-system";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect } from "react";
import { NOTES_PATH } from "../constants";
import { useLoading } from "../hooks/use-loading-dialog";
import { useRequest } from "../hooks/use-request";

export function AppStorageContext({ children }: PropsWithChildren) {
  const loading = useLoading();
  const { syncState } = useRequest();
  useEffect(() => {
    async function getUserData() {
      const { exists } = await getInfoAsync(NOTES_PATH);
      if (!exists) {
        await makeDirectoryAsync(NOTES_PATH);
        return;
      }
      loading("Loading notes...");
      await syncState();
      loading(false);
    }
    getUserData();
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });

  return children;
}
