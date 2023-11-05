import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, useEffect } from "react";
import { useRecoilState } from "recoil";
import { notesData } from "../../screens/note";

export function AppStorageContext({ children }: PropsWithChildren) {
  const [notes, setNotes] = useRecoilState(notesData);
  console.log(notes);
  useEffect(() => {
    const storeData = async (value: any) => {
      try {
        await AsyncStorage.setItem("userdata", JSON.stringify(value));
      } catch (e) {
        console.log(e);
      }
    };
    async function getData(key: any) {
      try {
        const res = await AsyncStorage.getItem(key);
        const notes = JSON.parse(res);
        if (notes) {
          setNotes({ data: notes });
        }
      } catch (e) {
        console.log(e);
      }
    }
    getData("userdata");
    return () => {
      storeData(notes.data);
    };
  }, []);

  return <>{children}</>;
}
