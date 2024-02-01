import { Dispatch, SetStateAction } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { BackIcon } from "../../../components";
import { TextNoteStyle, note } from "../types";
import { darkCardColors } from "../../../tools/colors";
type StyleCardProps = {
  text: string;
  item: TextNoteStyle;
  theme: any;
  background: string;
  setEditNote: Dispatch<SetStateAction<note>>;
};
export function StyleCard({
  text,
  item,
  theme,
  background,
  setEditNote,
}: StyleCardProps) {
  return (
    <>
      <Pressable
        style={{
          width: "100%",
          backgroundColor: theme?.onPrimary,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: theme?.primary,
            borderRadius: 8,
            padding: 6,
          }}
        >
          {text.slice(item.interval.start, item.interval.end)}
        </Text>

        <BackIcon
          btnProps={{ activeOpacity: 1 }}
          color={theme?.primary}
          style={{
            transform: [{ rotate: "270deg" }, { scaleY: 0.7 }],
            paddingBottom: 6,
          }}
        />
        <View
          style={{
            backgroundColor: background.includes("/")
              ? theme?.primary
              : background,
            padding: 6,
            borderRadius: 16,
            margin: 6,
          }}
        >
          <Text
            style={{
              color: darkCardColors.includes(background) ? "#fff" : "#000",
              ...item.style,
            }}
          >
            {text.slice(item.interval.start, item.interval.end)}
          </Text>
        </View>
      </Pressable>
      <TouchableOpacity
        onPress={() =>
          setEditNote((prev) => ({
            ...prev,
            styles: prev.styles.filter((e) => e !== item),
          }))
        }
        style={{
          backgroundColor: theme?.onBackground,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 12,
          alignSelf: "center",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "orangered" }}>Remove</Text>
      </TouchableOpacity>
    </>
  );
}
