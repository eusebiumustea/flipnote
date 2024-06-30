import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { memo, useMemo } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";
import { Text } from "react-native-fast-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks";
import { moderateFontScale } from "../../utils";
import { Button } from "../button";
import { DialogProps } from "./types";

export const Dialog = memo(
  ({
    onCancel,

    visible,
    title,
    children,
    buttons,
    animation = "none",
    statusBarTranslucent = false,
    styles,
    backgroundBlur = false,
    buttonsContainerStyle,
    animate,
  }: DialogProps) => {
    const theme = useTheme();

    const filteredButtons = useMemo(() => {
      return buttons.filter((btn) => !btn.hidden);
    }, [buttons]);
    const { height } = useWindowDimensions();
    const { top } = useSafeAreaInsets();
    return (
      <Modal
        statusBarTranslucent={statusBarTranslucent}
        transparent
        onRequestClose={onCancel}
        visible={visible}
        animationType={animation}
      >
        {backgroundBlur && (
          <BlurView
            intensity={35}
            tint="dark"
            style={{
              flex: 1,
              zIndex: -2,
            }}
          />
        )}
        {!backgroundBlur && (
          <View
            style={{
              flex: 1,
              backgroundColor: "#000",
              zIndex: -2,
              opacity: 0.6,
            }}
          />
        )}

        <View
          style={{
            height,
            width: "100%",
            position: "absolute",
            // zIndex: 1,
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={onCancel}
            style={{
              width: "100%",
              height: height + top,
              position: "absolute",
              zIndex: -1,
            }}
          />
          <MotiView
            transition={{ type: "timing", duration: 200 }}
            animate={animate}
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
            {children}
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
                columnGap: 12,
                flexDirection: "row",
                position: "absolute",
                bottom: 0,
                right: 0,
                margin: 10,
                ...buttonsContainerStyle,
              }}
            >
              <Button onPress={onCancel}>Cancel</Button>
              {filteredButtons.map(({ title, onPress, loading }, i) => (
                <Button key={i} loading={loading} onPress={onPress}>
                  {title}
                </Button>
              ))}
            </View>
          </MotiView>
        </View>
      </Modal>
    );
  }
);
