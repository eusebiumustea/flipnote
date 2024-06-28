import { StackCardStyleInterpolator } from "@react-navigation/stack";

type InterpolateStylesProps = {
  initial: {
    x: number;
    y: number;
    scaleX?: number;
    scaleY?: number;
    scale?: number;
  };
};
export function TransitionInterpolator({
  initial: { scale = 0, scaleX = 0, scaleY = 0, x = 0, y = 0 },
}: InterpolateStylesProps): StackCardStyleInterpolator {
  return ({
    current,
    layouts: {
      screen: { width, height },
    },
  }) => {
    return {
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-width / 2 + x, 0],
            }),
          },
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-height / 2 + y, 0],
            }),
          },
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [scale, 1],
            }),
          },
          {
            scaleX:
              scaleX > 0
                ? current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [scaleX, 1],
                  })
                : 1,
          },
          {
            scaleY:
              scaleY > 0
                ? current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [scaleY, 1],
                  })
                : 1,
          },
        ],
      },
    };
  };
}
