import { Fragment, useMemo } from "react";
import { Text } from "react-native";
import { TextNoteStyle } from "../screens";
import { removeEmptySpace } from "../tools";
// read-only
export function useNoteContent(styles: TextNoteStyle[], text: string) {
  return useMemo(() => {
    const isStyled = styles.length > 0;
    if (isStyled) {
      return (
        <>
          <Text>
            {removeEmptySpace(text.slice(0, styles[0]?.interval?.start))}
          </Text>
          {styles.map((e, i, arr) => {
            const start = e?.interval?.start;
            const end = e?.interval?.end;
            const nextStart = arr[i + 1]?.interval?.start;
            const style = e?.style;
            return (
              <Fragment key={i}>
                <Text style={{ ...style, fontSize: 14 }}>
                  {removeEmptySpace(text.slice(start, end))}
                </Text>
                <Text>{removeEmptySpace(text.slice(end, nextStart))}</Text>
              </Fragment>
            );
          })}
        </>
      );
    }
    return <Text>{removeEmptySpace(text).substring(0, 150)}</Text>;
  }, [styles, text]);
}
export function useEditNoteContent(styles: TextNoteStyle[], text: string) {
  return useMemo(() => {
    const isStyled = styles.length > 0;
    if (isStyled) {
      return (
        <>
          <Text>{text.slice(0, styles[0]?.interval?.start)}</Text>
          {styles.map((e, i, arr) => {
            const start = e?.interval?.start;
            const end = e?.interval?.end;
            const nextStart = arr[i + 1]?.interval?.start;
            const style = e?.style;
            return (
              <Fragment key={i}>
                <Text style={style}>{text.slice(start, end)}</Text>
                <Text>{text.slice(end, nextStart)}</Text>
              </Fragment>
            );
          })}
        </>
      );
    }
    return <Text>{text}</Text>;
  }, [styles, text]);
}
