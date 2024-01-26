import { AnimatePresence, MotiView } from "moti";
import { PropsWithChildren } from "react";
import { Modal } from "react-native";
import { ScreenProps } from "./type";

export function AnimatedScreen({
  open,
  onClose,
  initial,
  animate,
  exit,
  transition,
  exitTransition,
  children,
  containerStyle,
  overlay = true,
}: PropsWithChildren<ScreenProps>) {
  return (
    <AnimatePresence>
      {open && (
        <Modal
          animationType="none"
          onRequestClose={onClose}
          transparent
          visible={open}
        >
          {overlay && (
            <MotiView
              transition={transition}
              exitTransition={exitTransition}
              from={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                backgroundColor: "#000",
                zIndex: -1,
              }}
            />
          )}

          <MotiView
            style={{ flex: 1, ...containerStyle }}
            transition={transition}
            exitTransition={exitTransition}
            from={initial}
            animate={animate}
            exit={exit}
          >
            {children}
          </MotiView>
        </Modal>
      )}
    </AnimatePresence>
  );
}
