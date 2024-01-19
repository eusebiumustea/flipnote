import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import { Text } from "react-native-fast-text";
export const LoadingContext =
  createContext<Dispatch<SetStateAction<boolean>>>(null);

export function LoadingDialog({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={setLoading}>
      <Modal transparent visible={loading} animationType="fade">
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
          <Text style={{}}>Loading...</Text>
        </View>
      </Modal>
      {children}
    </LoadingContext.Provider>
  );
}
