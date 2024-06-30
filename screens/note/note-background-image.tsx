import { MotiView } from "moti";
import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { memo } from "react";
interface NoteBackgroundImageProps {
  show: boolean;
  overlayOpacity: number;
  uri: string;
}
export const NoteBackgroundImage = memo(
  ({ show, overlayOpacity, uri }: NoteBackgroundImageProps) => {
    const { width, height } = useWindowDimensions();
    const { top } = useSafeAreaInsets();
    if (show) {
      return (
        <>
          <MotiView
            transition={{ type: "timing", duration: 200 }}
            from={{ opacity: 0 }}
            animate={{ opacity: overlayOpacity }}
            style={{
              height: height + top,
              width,
              position: "absolute",
              zIndex: -1,
              top: 0,
              backgroundColor: "#000",
            }}
          />
          <Image
            source={{
              uri,
            }}
            style={{
              height: height + top,
              width,
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
