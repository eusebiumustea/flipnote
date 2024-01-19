import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { note, notesData } from "../screens/note";
import { changeKeyValuesConditionaly, recalculateId } from "../tools";
import { useToast } from "../components/toast";
import { useLoading } from "../hooks/use-loading-dialog";
import { NOTES_PATH } from "../constants";

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
  const loading = useLoading();
  useEffect(() => {
    async function getData() {
      const { exists } = await FileSystem.getInfoAsync(NOTES_PATH);
      if (!exists) {
        await FileSystem.makeDirectoryAsync(NOTES_PATH).then(() =>
          console.log("init dir")
        );
        return;
      }

      try {
        await FileSystem.readDirectoryAsync(NOTES_PATH).then((files) => {
          console.log(files);
          const tempNotes: note[] = [];
          if (files.length > 0) {
            console.log(files);
            files.map(async (file) => {
              const content = await FileSystem.readAsStringAsync(
                `${NOTES_PATH}/${file}`
              );
              const note: note = JSON.parse(content);
              tempNotes.push(note);

              if (tempNotes.length === files.length) {
                console.log(tempNotes);
                setNotes((prev) => ({ ...prev, data: tempNotes }));
              }
            });
          }
        });
      } catch (e) {
        loading(false);
      }
    }
    getData();
  }, []);
  // useEffect(() => {
  //   const storeData = async (value: note[]) => {
  //     try {
  //       await FileSystem.writeAsStringAsync(dataUri, JSON.stringify(value));
  //     } catch (e) {
  //       console.log(e);
  //       toast({
  //         message: "Failed to save note in appdata!",
  //         textColor: "red",
  //       });
  //     }
  //   };
  //   storeData(notes.data);
  // }, [notes]);

  return children;
}
