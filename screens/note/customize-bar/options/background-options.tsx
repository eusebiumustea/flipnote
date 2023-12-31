import { ColorBox } from "../../../../components";
import { OptionProps } from "../../types";

export function BackgroundOptions({
  colors,
  setEditNote,
  editNote,
}: OptionProps) {
  return (
    <>
      {colors.map((e, i) => {
        return (
          <ColorBox
            onPress={() => setEditNote((prev) => ({ ...prev, background: e }))}
            bgColor={e}
            key={i}
            checked={editNote.background === e}
          />
        );
      })}
    </>
  );
}
