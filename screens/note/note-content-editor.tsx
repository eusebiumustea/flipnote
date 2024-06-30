import { RouteProp, useRoute } from "@react-navigation/native";
import { useCardAnimation } from "@react-navigation/stack";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  memo,
  useCallback,
  useRef,
} from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { useTheme } from "../../hooks";
import { dateTime, debounce, verticalScale } from "../../utils";
import { ReanimatedView } from "../../utils/reanimated-view";
import { NoteTitleInput } from "./note-title-input";
import { Note } from "./types";
interface NoteContentEditorProps {
  editNote: Note;
  setEditNote: Dispatch<SetStateAction<Note>>;
  capturing: boolean;
  showTitle: boolean;
  defaultContentTheme: string;
  viewShotRef: MutableRefObject<ViewShot>;

  captureBackground: string | null;
  bottomSpace: SharedValue<number>;
}

export const NoteContentEditor = memo(
  forwardRef(
    (
      {
        editNote,
        setEditNote,
        capturing,
        showTitle,
        defaultContentTheme,
        viewShotRef,

        captureBackground,
        bottomSpace,
      }: NoteContentEditorProps,
      editorRef: MutableRefObject<RichEditor>
    ) => {
      const scrollRef = useRef<ScrollView>(null);
      const { top } = useSafeAreaInsets();
      const theme = useTheme();

      const {
        params: { isCreating },
      } = useRoute<RouteProp<{}>>();
      const isImgBg = editNote.background.includes("/");
      const { closing, current } = useCardAnimation();
      const animatedStyle = useAnimatedStyle(() => {
        return {
          paddingBottom: bottomSpace.value,
        };
      });
      return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              !capturing && {
                paddingBottom: verticalScale(150),
                paddingTop: verticalScale(70) + top,
              }
            }
            style={{
              flex: 1,
              opacity: closing && current.progress,
            }}
          >
            <ReanimatedView style={[{ flex: 1 }, animatedStyle]}>
              <ViewShot
                style={{
                  backgroundColor: captureBackground,
                  paddingVertical: capturing && editNote.title.length > 0 && 12,
                }}
                options={{
                  result: "tmpfile",
                  fileName: `flipnote-${dateTime(new Date(), false)}`,
                }}
                ref={!isImgBg && Platform.OS === "android" ? viewShotRef : null}
              >
                {showTitle && (
                  <NoteTitleInput
                    editNote={editNote}
                    setEditNote={setEditNote}
                  />
                )}

                <RichEditor
                  placeholder="Take the note"
                  ref={editorRef}
                  minimumFontSize={16}
                  bounces={false}
                  pasteAsPlainText={true}
                  editorInitializedCallback={useCallback(() => {
                    if (!isCreating) {
                      return editorRef.current.setContentHTML(editNote.text);
                    }
                  }, [])}
                  editorStyle={{
                    backgroundColor: "transparent",
                    color: defaultContentTheme,
                    placeholderColor: theme.placeholder,
                    initialCSSText: "div h1 span {font-size: 16px}",
                  }}
                  onChange={debounce((html: string) => {
                    console.log(html);

                    setEditNote((prev) => ({ ...prev, text: html }));
                  }, 0)}
                />
              </ViewShot>
            </ReanimatedView>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
      );
    }
  )
);
