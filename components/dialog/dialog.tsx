import { BlurView } from "expo-blur";
import { memo, useMemo } from "react";
import { Modal, Text, View, useWindowDimensions } from "react-native";
import { useTheme } from "../../hooks";
import { moderateFontScale } from "../../utils";
import { Button } from "../button";
import { DialogProps } from "./types";

export const Dialog = memo(
  ({
    onCencel,

    visible,
    title,
    children,
    buttons,
    animation = "none",
    statusBarTranslucent = false,
    styles,
    backgroundBlur = false,
    buttonsContainerStyle,
  }: DialogProps) => {
    const theme = useTheme();
    const filteredButtons = useMemo(() => {
      return buttons.filter((btn) => !btn.hidden);
    }, [buttons]);
    const { height } = useWindowDimensions();
    return (
      <Modal
        statusBarTranslucent={statusBarTranslucent}
        transparent
        onRequestClose={onCencel}
        visible={visible}
        animationType={animation}
      >
        {backgroundBlur && (
          <BlurView
            intensity={35}
            tint="dark"
            style={{
              flex: 1,

              zIndex: -1,
            }}
          />
        )}
        {!backgroundBlur && (
          <View
            style={{
              flex: 1,
              backgroundColor: "#000",
              zIndex: -1,
              opacity: 0.6,
            }}
          />
        )}

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
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.17,
              shadowRadius: 3.05,
              ...styles,
            }}
          >
            <View style={{ width: "100%", padding: 25 }}>{children}</View>
            <Text
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                paddingHorizontal: 10,
                paddingVertical: 5,
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
                ...buttonsContainerStyle,
              }}
            >
              <Button onPress={onCencel}>Cencel</Button>
              {filteredButtons.map(({ title, onPress }, i) => (
                <Button key={i} onPress={onPress}>
                  {title}
                </Button>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
