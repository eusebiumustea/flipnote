import { ActivityIndicator, Modal, View } from "react-native";
import { LoadingTypes } from "./types";

export function Loading({ show }: LoadingTypes) {
  return (
    <Modal animationType="fade" transparent={true} visible={show}>
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
