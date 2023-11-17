import {
  Modal,
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { moderateFontScale, useTheme } from "../../tools";
import { DialogProps } from "./types";

export function Dialog({
  onCencel,
  action,
  visible,
  title,
  children,
  actionLabel,
  animation = "none",
  statusBarTranslucent = false,
}: DialogProps) {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  return (
    <Modal
      statusBarTranslucent={statusBarTranslucent}
      transparent
      onRequestClose={onCencel}
      visible={visible}
      animationType={animation}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.onPrimary,
          zIndex: -1,
          opacity: 0.4,
        }}
      />
      <View
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: theme.primary,
            height: "auto",
            justifyContent: "center",
            alignSelf: "center",
            padding: 10,
            flexDirection: "column",
            maxHeight: height / 2,
            paddingBottom: 30,
            elevation: 10,
            borderRadius: 16,
          }}
        >
          {children}
          <Text
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              padding: 10,
              color: theme.onPrimary,
              fontSize: moderateFontScale(16),
            }}
          >
            {title}
          </Text>

          <View
            style={{
              columnGap: 20,
              flexDirection: "row",
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 10,
            }}
          >
            <TouchableOpacity onPress={onCencel}>
              <Text
                style={{
                  fontSize: moderateFontScale(15),
                  fontFamily: "google-sans",
                  fontWeight: "bold",
                  color: theme.onPrimary,
                }}
              >
                Cencel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={action}>
              <Text
                style={{
                  fontSize: moderateFontScale(15),
                  fontFamily: "google-sans",
                  fontWeight: "bold",
                  color: theme.onPrimary,
                }}
              >
                {actionLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
