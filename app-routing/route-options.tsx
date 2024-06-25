import { ParamListBase, RouteProp } from "@react-navigation/native";
import {
  StackNavigationOptions,
  TransitionSpecs,
} from "@react-navigation/stack";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { light } from "../constants";
import { shadows } from "../ui-config";
import { moderateScale, verticalScale } from "../utils";
import { TransitionInterpolator } from "./transition-interpolator";
import { Easing } from "react-native";
type NoteRouteParams = {
  relativeY: number;
  relativeX: number;
  isCreating: boolean;
};
interface NoteOptionsProps {
  route: RouteProp<ParamListBase>;
  navigation: StackNavigationHelpers;
}
export const note_options = (
  width: number,
  height: number,
  theme: typeof light
) => {
  return ({ route }: NoteOptionsProps): StackNavigationOptions => {
    const { relativeX, relativeY, isCreating } =
      route.params as NoteRouteParams;
    return {
      transitionSpec: {
        open: {
          animation: "spring",
          config: {
            overshootClamping: true,
            stiffness: 100,
            mass: 0.1,
            damping: 100,
          },
        },
        close: {
          animation: "timing",
          config: { duration: 160, easing: Easing.inOut(Easing.ease) },
        },
      },
      cardStyle: {
        ...shadows(theme),
      },
      cardStyleInterpolator: isCreating
        ? TransitionInterpolator({
            initial: {
              scale: 0,
              y: relativeY + verticalScale(40),
              x: relativeX + moderateScale(40),
            },
          })
        : TransitionInterpolator({
            initial: {
              scale: 1,
              scaleX: (width / 2 - 16) / width,
              scaleY: verticalScale(250) / height,
              y: verticalScale(125) + relativeY,
              x: (width / 2 - 16) / 2 + relativeX,
            },
          }),
    };
  };
};
