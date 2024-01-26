import { PropsWithChildren, createContext } from "react";
import { Animated, useAnimatedValue } from "react-native";

export const AnimatedValueContext = createContext<Animated.Value>(undefined);

export function AnimatedScrollValueProvider({ children }: PropsWithChildren) {
  const scrollY = useAnimatedValue(0);
  return (
    <AnimatedValueContext.Provider value={scrollY}>
      {children}
    </AnimatedValueContext.Provider>
  );
}
