import { getInfoAsync, makeDirectoryAsync } from "expo-file-system";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useToast } from "../components/toast";
import { NOTES_PATH, imagesData } from "../constants";
import { useLoading } from "../hooks/use-loading-dialog";
import { useRequest } from "../hooks/use-request";
import { BackgroundImages } from "../screens/note";
export function AppStorageContext({ children }: PropsWithChildren) {
  useRecoilState(BackgroundImages);
  const toast = useToast();
  const loading = useLoading();
  const { syncState, syncImagesState } = useRequest();
  useEffect(() => {
    async function getUserData() {
      const { exists } = await getInfoAsync(NOTES_PATH);
      if (!exists) {
        await makeDirectoryAsync(NOTES_PATH);
        return;
      }
      loading("Loading notes...");
      await syncImagesState();
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
