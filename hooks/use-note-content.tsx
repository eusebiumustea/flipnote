import { useMemo } from "react";
import { TextStyle, Text } from "react-native";
import { darkCardColors } from "../constants/colors";
import { TextNoteStyle } from "../screens";
export function useEditNoteContent(
  styles: TextNoteStyle[],
  text: string,
  bg: string,
  imageOpacity?: number
) {
  const defaultThemeText = useMemo(() => {
    if (imageOpacity > 0.4) {
      return "#ffffff";
    }
    if (darkCardColors.includes(bg)) {
      return "#ffffff";
    } else {
      return "#000000";
    }
  }, [imageOpacity, bg]);
  function font(fontName: string, style: TextStyle) {
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
  return useMemo(() => {
    const isStyled = styles.length > 0;
    if (isStyled) {
      return (
        <Text style={{ color: defaultThemeText }}>
          {text.slice(0, styles[0]?.interval.start)}
          {styles.map((e, i, arr) => {
            const start = e?.interval.start;
            const end = e?.interval.end;
            const nextStart = arr[i + 1]?.interval.start;
            const style = e.style;
            return (
              <Text key={i}>
                <Text
                  style={{
                    ...style,
                    fontFamily:
                      style?.fontFamily !== undefined
                        ? font(style.fontFamily, style)
                        : undefined,
                  }}
                >
                  {text.slice(start, end)}
                </Text>
                <Text>{text.slice(end, nextStart)}</Text>
              </Text>
            );
          })}
        </Text>
      );
    }
    return <Text style={{ color: defaultThemeText }}>{text}</Text>;
  }, [styles, bg, imageOpacity]);
}
