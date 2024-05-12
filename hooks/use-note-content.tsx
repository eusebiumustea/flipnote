import { useMemo } from "react";
import { Platform, Text, TextStyle } from "react-native";
import { HTML_FONTS } from "../constants";
import { darkCardColors } from "../constants/colors";
import { TextNoteStyle } from "../screens";
import { convertToCSS, font, fontCSS } from "../utils/style-converter";

export function useHTMLRenderedContent(
  styles: TextNoteStyle[],
  text: string,
  title: string,
  bg: string,
  imageOpacity: number,
  contentPosition: "left" | "center" | "right",
  imageData?: string
) {
  const defaultThemeText = useMemo(() => {
    if (darkCardColors.includes(bg)) {
      return "#ffffff";
    } else {
      return "#000000";
    }
  }, [bg]);
  const isStyled = styles.length > 0;
  if (isStyled) {
    return `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
     ${HTML_FONTS}
      </style>
    </head>
    <body style="background-color: ${
      bg.includes("/") ? "transparent" : bg
    };margin:0px">
    ${
      bg.includes("/")
        ? `<div style="position: fixed; top: 0px; z-index: -2; width: 100vw; height: 100vh; background-image: url(${imageData});"></div>
        <div style="position: fixed; top: 0px; z-index: -1; width: 100vw; height: 100vh; background-color: #000; opacity: ${imageOpacity}"></div>`
        : ""
    }
    ${
      title.length > 0
        ? `<h1 style="font-size: 60px; text-align: ${contentPosition}; color: ${defaultThemeText}; margin-right: 32px; margin-left: 32px; margin-top: 32px; margin-bottom: 36px; font-weight: bold;">${title}</h1>`
        : ""
    }
          <h1 style="font-size: 32px; font-style: normal; text-decoration: none; font-weight: 400; text-align: ${contentPosition}; color: ${defaultThemeText}; margin: 32px">
          ${
            text.slice(0, styles[0]?.interval.start).length > 0
              ? text.slice(0, styles[0]?.interval.start)
              : ""
          }
          ${styles.map((e, i, arr) => {
            const start = e?.interval.start;
            const end = e?.interval.end;
            const nextStart = arr[i + 1]?.interval.start;
            const style = convertToCSS(e.style);
            return `<span
                     style="${style.join(" ")}"
                >
                  ${text.slice(start, end)}
                </span>${
                  text.slice(end, nextStart).length > 0
                    ? `<span>${text.slice(end, nextStart)}</span>`
                    : ""
                }
                `;
          })}
          </h1>
      </body>
      </html>`;
  }
  return `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="background: ${
    bg.includes("/") ? "transparent" : bg
  }; margin: 0px">
  ${
    bg.includes("/")
      ? `<div style="position: fixed; top: 0px; z-index: -2; width: 100vw; height: 100vh; background-image: url(${imageData});"></div>
      <div style="position: fixed; top: 0px; z-index: -1; width: 100vw; height: 100vh; background-color: #000; opacity: ${imageOpacity}"></div>`
      : ""
  }
     ${
       title.length > 0
         ? `<h1 style="font-size: 60px; text-align: ${contentPosition}; color: ${defaultThemeText}; margin-right: 32px; margin-left: 32px; margin-top: 32px; margin-bottom: 36px; font-weight: bold;">${title}</h1>`
         : ""
     }
     <h1 style="font-size: 32px; font-style: normal; text-decoration: none; text-align: ${contentPosition}; color: ${defaultThemeText}; margin: 32px; font-weight: 400;">${text}</h1>
  </body>
  </html>`;
}
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

  return useMemo(() => {
    const isStyled = styles.length > 0;
    if (isStyled) {
      return (
        <Text style={{ color: defaultThemeText }}>
          {text.slice(0, styles[0]?.interval.start).length > 0 &&
            text.slice(0, styles[0]?.interval.start)}
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
                {text.slice(end, nextStart).length > 0 && (
                  <Text>{text.slice(end, nextStart)}</Text>
                )}
              </Text>
            );
          })}
        </Text>
      );
    }
    return <Text style={{ color: defaultThemeText }}>{text}</Text>;
  }, [styles, bg, imageOpacity]);
}
