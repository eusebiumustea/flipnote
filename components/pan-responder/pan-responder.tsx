import { PanResponder } from "react-native";
import { PanResponderProps } from "./type";

export function Swipe({ onRelease, onMove }: PanResponderProps) {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: onMove,
    onPanResponderRelease: onRelease,
  }).panHandlers;
}
