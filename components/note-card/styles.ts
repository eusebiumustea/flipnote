import { ViewStyle } from "react-native";
import { NotePreviewTypes } from "../../screens";
import { verticalScale } from "../../utils";
import { dark } from "../../constants/colors";
import { shadows } from "../../ui-config";

export const noteCardStyles = (theme: typeof dark) =>
  ({
    root: (props: {
      width: number;
      item: NotePreviewTypes;
      containerStyle: ViewStyle;
    }) => ({
      height: verticalScale(250),
      width: props.width / 2 - 16,
      borderRadius: 16,
      padding: 16,

      ...shadows(theme),
      overflow: "hidden",
      backgroundColor: props.item.background || "#fff",
      ...props.containerStyle,
    }),
  } as const);
