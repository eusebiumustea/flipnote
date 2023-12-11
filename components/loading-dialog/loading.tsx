import { ActivityIndicator, Modal, View } from "react-native";
import { LoadingContextProps, LoadingTypes } from "./types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
const LoadingContext = createContext<LoadingContextProps>(undefined);
function Loading({ show }: LoadingTypes) {
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent={true}
      visible={show}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          opacity: 0.7,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    </Modal>
  );
}
export function LoadingProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(false);
  function ShowLoading(show: boolean) {
    setLoading(show);
  }
  return (
    <LoadingContext.Provider value={{ ShowLoading }}>
      <Loading show={loading} />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    return;
  }
  return ctx.ShowLoading;
}
