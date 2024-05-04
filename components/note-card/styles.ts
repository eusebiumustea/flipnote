import { ViewStyle } from "react-native";
import { NotePreviewTypes } from "../../screens";
import { verticalScale } from "../../utils";
import { dark } from "../../constants/colors";

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
      elevation: 7,
      shadowColor: theme.onPrimary,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      backgroundColor: props.item.background.includes("/")
        ? "#fff"
        : props.item.background,
      ...props.containerStyle,
    }),
  } as const);
