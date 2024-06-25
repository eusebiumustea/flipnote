import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";
import {
  ActivityIndicator,
  Modal,
  View,
  useWindowDimensions,
} from "react-native";
import { Text } from "react-native-fast-text";
import { moderateFontScale } from "../utils";
export const LoadingContext =
  createContext<Dispatch<SetStateAction<boolean | string>>>(null);

export function LoadingDialog({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean | string>(false);
  const { height } = useWindowDimensions();
  return (
    <LoadingContext.Provider value={setLoading}>
      {loading && (
        <Modal transparent animationType="fade">
          <View
            style={{
              width: "100%",
              height,
              position: "absolute",
              backgroundColor: "#fff",
              opacity: 0.7,
              zIndex: -1,
            }}
          />
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <ActivityIndicator size={"large"} />
            <Text style={{ fontSize: moderateFontScale(17) }}>
              {loading !== true ? loading : "Loading..."}
            </Text>
          </View>
        </Modal>
      )}

      {children}
    </LoadingContext.Provider>
  );
}
