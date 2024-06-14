import { ParamListBase, RouteProp } from "@react-navigation/native";
import {
  StackNavigationOptions,
  TransitionSpecs,
} from "@react-navigation/stack";
import { Easing } from "react-native-reanimated";
import { moderateScale, verticalScale } from "../utils";
import { TransitionInterpolator } from "./transition-interpolator";
import { shadows } from "../ui-config";
import { light } from "../constants";
import { Platform } from "react-native";
type NoteRouteParams = {
  relativeY: number;
  relativeX: number;
};
export const note_options = (
  width: number,
  height: number,
  theme: typeof light
) => {
  return ({
    route,
  }: {
    route: RouteProp<ParamListBase>;
  }): StackNavigationOptions => {
    const { relativeX, relativeY } = route.params as NoteRouteParams;
    return {
      transitionSpec: {
        open: {
          animation: "spring",
          config: { overshootClamping: true, stiffness: 100 },
        },
        close: {
          animation: "timing",
          config: { duration: 160, easing: Easing.sin },
        },
      },
      cardStyle: { ...shadows(theme) },
      cardStyleInterpolator: TransitionInterpolator({
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

export const note_init_options = ({
  route,
}: {
  route: RouteProp<ParamListBase>;
}): StackNavigationOptions => {
  const { relativeX, relativeY } = route.params as NoteRouteParams;
  return {
    cardOverlayEnabled: true,
    detachPreviousScreen: false,
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: {
        animation: "timing",
        config: { duration: 160 },
      },
    },
    cardStyleInterpolator: TransitionInterpolator({
      initial: {
        scale: 0,
        y: relativeY + verticalScale(40),
        x: relativeX + moderateScale(40),
      },
    }),
  };
};
