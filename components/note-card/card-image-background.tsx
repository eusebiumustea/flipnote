import { Image } from "expo-image";
import { memo } from "react";
import { DimensionValue, View } from "react-native";
interface CardBackgroundImageProps {
  show: boolean;
  overlayOpacity: number;
  uri: string;
  width: DimensionValue;
  height: DimensionValue;
}
export const CardBackgroundImage = memo(
  ({ show, overlayOpacity, uri, width, height }: CardBackgroundImageProps) => {
    if (show) {
      return (
        <>
          <View
            pointerEvents="none"
            style={{
              height,
              width,
              position: "absolute",
              zIndex: -1,
              top: 0,
              borderRadius: 14,
              backgroundColor: "#000",
              opacity: overlayOpacity,
            }}
          />
          <Image
            pointerEvents="none"
            transition={{ duration: 100 }}
            source={{ uri }}
            style={{
              height,
              width,
              borderRadius: 16,
              position: "absolute",
              zIndex: -2,
              top: 0,
            }}
          />
        </>
      );
    }
  }
);
