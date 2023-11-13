import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Modal, Text, View } from "react-native";
import { moderateFontScale, useTheme } from "../../tools";
interface ToastComponentProps {
  message: string | null;
  show?: boolean;
}
interface ToastContextType {
  ShowToast: (props: ToastComponentProps) => void | null;
}
function ToastComponent({ message, show }: ToastComponentProps) {
  const theme = useTheme();
  return (
    <Modal visible={show} transparent animationType="fade">
      <View
        style={{
          position: "absolute",
          top: 30,
          backgroundColor: theme.primary,
          borderRadius: 16,
          alignSelf: "center",
          padding: 10,
          justifyContent: "center",
          elevation: 15,
        }}
      >
        <Text
          style={{
            fontSize: moderateFontScale(20),
            fontWeight: "bold",
            color: theme.onPrimary,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      </View>
    </Modal>
  );
}
const ToastContext = createContext<ToastContextType>(undefined);
export function ToastProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<ToastComponentProps>({
    show: false,
    message: null,
  });
  function ShowToast({ message }: ToastComponentProps) {
    setConfig({ show: true, message });
    setTimeout(() => setConfig({ show: false, message: null }), 600);
  }
  return (
    <ToastContext.Provider value={{ ShowToast }}>
      {children}
      <ToastComponent message={config.message} show={config.show} />
    </ToastContext.Provider>
  );
}
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return;
  }
  return ctx.ShowToast;
}
