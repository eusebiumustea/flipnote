import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect } from "react";
import { useLoading } from "../hooks/use-loading-dialog";
import { useRequest } from "../hooks/use-request";

export function AppStorageContext({ children }: PropsWithChildren) {
  const loading = useLoading();
  const { syncState } = useRequest();
  useEffect(() => {
    async function getUserData() {
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
