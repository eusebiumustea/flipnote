import { Fragment, useMemo } from "react";
import { Text, TextStyle } from "react-native";
import { TextNoteStyle } from "../screens";
import { darkCardColors } from "../tools/colors";

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
        <>
          <Text style={{ color: defaultThemeText }}>
            {text.slice(0, styles[0]?.interval?.start)}
          </Text>
          {styles.map((e, i, arr) => {
            const start = e?.interval?.start;
            const end = e?.interval?.end;
            const nextStart = arr[i + 1]?.interval?.start;
            const style = e?.style;
            return (
              <Fragment key={i}>
                <Text
                  style={{
                    color: defaultThemeText,
                    ...style,
                    fontFamily:
                      style?.fontFamily !== undefined
                        ? font(style.fontFamily, style)
                        : undefined,
                  }}
                >
                  {text.slice(start, end)}
                </Text>
                <Text style={{ color: defaultThemeText }}>
                  {text.slice(end, nextStart)}
                </Text>
              </Fragment>
            );
          })}
        </>
      );
    }
    return <Text style={{ color: defaultThemeText }}>{text}</Text>;
  }, [styles, text, bg, imageOpacity]);
}
