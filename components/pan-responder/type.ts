import { GestureResponderEvent, PanResponderGestureState } from "react-native";

export interface PanResponderProps {
  onRelease: (
    e?: GestureResponderEvent,
    state?: PanResponderGestureState
  ) => void;
  onMove?: (
    e?: GestureResponderEvent,
    state?: PanResponderGestureState
  ) => void;
}
