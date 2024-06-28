import { ParamListBase, RouteProp } from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { light } from "../constants";
import { shadows, springcfg } from "../ui-config";
import { moderateScale, verticalScale } from "../utils";
import { TransitionInterpolator } from "./transition-interpolator";
import { Easing } from "react-native";

export type NoteRouteParams = {
  id: number;
  relativeY: number;
  relativeX: number;
  isCreating: boolean;
  animationEnabled: boolean;
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
    const { relativeX, relativeY, isCreating, animationEnabled } =
      route.params as NoteRouteParams;
    return {
      animationEnabled,
      transitionSpec: {
        open: springcfg,
        close: {
          animation: "timing",
          config: { duration: 160, easing: Easing.bezier(1, 1, 0, 0) },
        },
      },
      cardStyle: {
        ...shadows(theme),
      },
      cardStyleInterpolator: TransitionInterpolator({
        initial: {
          scale: isCreating ? 0 : 1,
          scaleX: isCreating ? 1 : (width / 2 - 16) / width,
          scaleY: isCreating ? 1 : verticalScale(250) / height,
          y: isCreating
            ? relativeY + verticalScale(40)
            : verticalScale(125) + relativeY,
          x: isCreating
            ? relativeX + moderateScale(40)
            : (width / 2 - 16) / 2 + relativeX,
        },
      }),
    };
  };
};
