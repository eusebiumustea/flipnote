import { Dimensions, PixelRatio } from "react-native";
const { width, height } = Dimensions.get("window");
// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 392;
const guidelineBaseHeight = 844;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;
export const moderateFontScale = (size: number) =>
  size + (PixelRatio.getFontScale() * size - size) * -0.6;

export const moderateScale = (size: number) =>
  PixelRatio.roundToNearestPixel(size + (scale(size) - size) * 0.8);
