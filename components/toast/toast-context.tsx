import { AnimatePresence, MotiView } from "moti";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import {
  ColorValue,
  Text,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks";
import { moderateFontScale } from "../../utils";
interface ToastStateProps {
  message: string | null;
  textColor?: ColorValue;
  scaleAnimation?: {
    x: number;
    y: number;
  } | null;
  button?: {
    onPress: () => void;
    title: string;
    color?: ColorValue;
  } | null;
  duration?: number;
}
interface ToastContextType {
  ShowToast: (props: ToastStateProps) => void | null;
}
interface ToastComponentProps {
  config: ToastStateProps;
}
function ToastComponent({ config }: ToastComponentProps) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const initialStyles = config?.scaleAnimation
    ? {
        translateY: config.scaleAnimation.y,
        translateX: -width / 2 + config.scaleAnimation.x,
        scale: 0,
      }
    : { opacity: 0 };
  const animateStyles = config?.scaleAnimation
    ? { translateY: 0, translateX: 0, scale: 1 }
    : { opacity: 1 };
  return (
    <AnimatePresence>
      {config && (
        <MotiView
          transition={{
            type: "timing",
            duration: 260,
            easing: Easing.inOut(Easing.linear),
          }}
          style={{
            position: "absolute",
            top: 0,
            marginTop: top + 30,
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
          from={initialStyles}
          animate={animateStyles}
          exit={initialStyles}
        >
          <Text
            style={{
              fontSize: moderateFontScale(20),
              fontWeight: "bold",
              color: config.textColor,
              textAlign: "center",
            }}
          >
            {config.message}
          </Text>
          {config.button && (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Text
                onPress={config.button.onPress}
                style={{
                  fontSize: moderateFontScale(16),
                  color: config.button.color || "#007AFF",
                  textAlign: "center",
                  fontFamily: "OpenSans",
                  flexDirection: "row",
                }}
              >
                {config.button.title}
              </Text>
            </View>
          )}
        </MotiView>
      )}
    </AnimatePresence>
  );
}
const ToastContext = createContext<ToastContextType>(undefined);
export function ToastProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const [config, setConfig] = useState<ToastStateProps | null>(null);
  function ShowToast({
    message,
    button,
    scaleAnimation = null,
    textColor = theme.onPrimary,
    duration = 1500,
  }: ToastStateProps) {
    setConfig((prev) => ({
      ...prev,
      message,
      button,
      textColor,
      scaleAnimation,
    }));
    setTimeout(() => setConfig(null), duration);
  }
  return (
    <ToastContext.Provider value={{ ShowToast }}>
      <ToastComponent config={config} />
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
