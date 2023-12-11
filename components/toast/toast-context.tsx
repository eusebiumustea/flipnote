import { AnimatePresence, MotiView } from "moti";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { ColorValue, Text, TouchableOpacity } from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateFontScale, useTheme } from "../../tools";
interface ToastComponentProps {
  message: string | null;
  textColor?: ColorValue;
  button?: {
    onPress: () => void;
    title: string;
    color?: ColorValue;
  } | null;
  duration?: number;
  startPositionX?: number;
  startPositionY?: number;
}
interface ToastContextType {
  ShowToast: (props: ToastComponentProps) => void | null;
}
function ToastComponent({
  message,
  button,
  textColor,
  startPositionX,
  startPositionY,
}: ToastComponentProps) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <AnimatePresence>
      {message && (
        <MotiView
          transition={{
            type: "timing",
            duration: 350,
            easing: Easing.inOut(Easing.ease),
          }}
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
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.17,
            shadowRadius: 3.05,
          }}
          from={{
            translateY: -top + startPositionY,
            translateX: startPositionX,
            scale: 0,
          }}
          animate={{ translateY: 0, translateX: 0, scale: 1 }}
          exit={{
            translateY: -top + startPositionY,
            translateX: startPositionX,
            scale: 0,
          }}
        >
          <Text
            style={{
              fontSize: moderateFontScale(20),
              fontWeight: "bold",
              color: textColor,
              textAlign: "center",
            }}
          >
            {message}
          </Text>
          {button && (
            <TouchableOpacity onPress={button.onPress}>
              <Text
                style={{
                  fontSize: moderateFontScale(16),
                  color: button.color ? button.color : "#007AFF",
                  textAlign: "center",
                  fontFamily: "google-sans",
                }}
              >
                {button.title}
              </Text>
            </TouchableOpacity>
          )}
        </MotiView>
      )}
    </AnimatePresence>
  );
}
const ToastContext = createContext<ToastContextType>(undefined);
export function ToastProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const [config, setConfig] = useState<ToastComponentProps>({
    message: null,
    button: null,
    textColor: theme.onPrimary,
  });
  function ShowToast({
    message,
    button,
    textColor = theme.onPrimary,
    duration = 1500,
    startPositionX = 0,
    startPositionY = 0,
  }: ToastComponentProps) {
    setConfig((prev) => ({
      ...prev,
      message,
      button,
      textColor,
      startPositionX,
      startPositionY,
    }));
    setTimeout(
      () =>
        setConfig((prev) => ({
          ...prev,
          message: null,
          button: null,
        })),
      duration
    );
  }
  return (
    <ToastContext.Provider value={{ ShowToast }}>
      <ToastComponent
        textColor={config.textColor}
        button={config.button}
        message={config.message}
        startPositionX={config.startPositionX}
        startPositionY={config.startPositionY}
      />
      {children}
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
