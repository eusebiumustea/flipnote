import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Modal, Text, View } from "react-native";
import { moderateFontScale, useTheme } from "../../tools";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatePresence, MotiView } from "moti";
interface ToastComponentProps {
  message: string | null;
  show?: boolean;
}
interface ToastContextType {
  ShowToast: (props: ToastComponentProps) => void | null;
}
function ToastComponent({ message, show }: ToastComponentProps) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <AnimatePresence>
      {show && (
        <MotiView
          transition={{ type: "timing", duration: 160 }}
          style={{
            position: "absolute",
            top: top + 30,
            backgroundColor: theme.primary,
            borderRadius: 16,
            alignSelf: "center",
            padding: 10,
            justifyContent: "center",
            elevation: 15,
            zIndex: 999,
          }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
        </MotiView>
      )}
    </AnimatePresence>
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
