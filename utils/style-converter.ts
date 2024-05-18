import { TextStyle } from "react-native";
export function includeNewLines(value: string): string {
  if (value.includes("\n")) {
    return "white-space: pre-line;";
  }
  return "white-space: initial;";
}
export function fontCSS(fontName: string, style: string[]) {
  const weight = style.includes("font-weight: bold;");
  const italic = style.includes("font-style: italic;");
  if (weight && !italic) {
    return fontName + "-bold";
  }
  if (italic && !weight) {
    return fontName + "-italic";
  }
  if (italic && weight) {
    return fontName + "-bold-italic";
  }
  return fontName;
}
export function font(fontName: string, style: TextStyle) {
  const weight = style?.fontWeight;
  const italic = style?.fontStyle;
  if (weight && !italic) {
    return fontName + "-bold";
  }
  if (italic && !weight) {
    return fontName + "-italic";
  }
  if (italic && weight) {
    return fontName + "-bold-italic";
  }
  return fontName;
}
export function convertToCSS(style: TextStyle) {
  return Object.entries(style).map((e) => {
    switch (e[0]) {
      case "fontWeight":
        return `font-weight: ${e[1]};`;
      case "fontStyle":
        return `font-style: ${e[1]};`;
      case "textDecorationLine":
        return `text-decoration: ${e[1]};`;
      case "fontSize":
        return `font-size: ${e[1] * 2}px;`;
      case "fontFamily":
        return `font-family: ${font(e[1], style)};`;
      default:
        return `${e[0]}: ${e[1]};`;
    }
  });
}
