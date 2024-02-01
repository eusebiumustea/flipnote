type InterpolateStylesProps = {
  overlay?: boolean;
  fade?: boolean;
  initial: {
    x: number;
    y: number;
    scaleX?: number;
    scaleY?: number;
    scale?: number;
  };
};
export function TransitionInterpolator({
  fade,
  overlay = true,
  initial: { scale = 0, scaleX = 0, scaleY = 0, x, y },
}: InterpolateStylesProps) {
  return ({
    current,
    layouts: {
      screen: { width, height },
    },
  }) => ({
    overlayStyle: {
      opacity: overlay
        ? current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          })
        : 0,
    },

    cardStyle: {
      opacity: fade ? current.progress : 1,
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
      borderRadius: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
      }),
    },
  });
}