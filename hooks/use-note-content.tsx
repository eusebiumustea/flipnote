import { DependencyList, Fragment, useMemo } from "react";
import { Text } from "react-native";
import { InputSelectionProps, TextNoteStyle } from "../screens";
import { darkCardColors } from "../tools/colors";

export function useEditNoteContent(
  styles: TextNoteStyle[],
  text: string,
  bg: string
) {
  const defaultThemeText = useMemo(() => {
    if (darkCardColors.includes(bg)) {
      return "#ffffff";
    } else {
      return "#000000";
    }
  }, [bg]);
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
                <Text style={{ color: defaultThemeText, ...style }}>
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
  }, [styles, text, bg]);
}
