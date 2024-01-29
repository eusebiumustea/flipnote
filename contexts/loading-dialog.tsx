import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import { Text } from "react-native-fast-text";
import { moderateFontScale } from "../tools";

export const LoadingContext =
  createContext<Dispatch<SetStateAction<boolean | string>>>(null);

export function LoadingDialog({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean | string>(false);

  return (
    <LoadingContext.Provider value={setLoading}>
      <Modal transparent visible={loading !== false} animationType="fade">
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
          <Text style={{ fontSize: moderateFontScale(17) }}>
            {typeof loading === "string" ? loading : "Loading..."}
          </Text>
        </View>
      </Modal>
      {children}
    </LoadingContext.Provider>
  );
}
