import { ColorValue, OpaqueColorValue } from "react-native";
import { TextNoteStyle, note } from "../screens/note";
export function toggleArrayElement<T>(array: T[], value: T) {
  const indexOfValue = array.indexOf(value);
  if (indexOfValue === -1) {
    return [...array, value];
  }
  return removeElementAtIndex(array, indexOfValue);
}

export function toggleState<T>(
  initialValue: T,
  changeValue: T,
  additionalFunction?: () => void
) {
  return (prevState: T) => {
    if (prevState !== changeValue) {
      additionalFunction && additionalFunction();
      return changeValue;
    } else {
      return initialValue;
    }
  };
}
export function toggleObjectKeyValue<O, K extends keyof O>(
  object: O,
  key: K,
  value: any
) {
  if (Object.keys(object).includes(key.toString())) {
    return removeObjectKey(object, key);
  }

  return { ...object, [key]: value };
}
export function removeElementAtIndex<T>(array: T[], removeIndex: number) {
  return [...array.slice(0, removeIndex), ...array.slice(removeIndex + 1)];
}
export function generateUniqueFileId() {
  const time = new Date().getTime;
  const random = Math.floor(Math.random() * 10000);
  return `${time}-${random}`;
}
// export function removeElementAtId(array: note[], removeId: number) {
//   const arrayIndexOfId = array.findIndex((e) => e?.id === removeId);
//   return [
//     ...array.slice(0, arrayIndexOfId),
//     ...array.slice(arrayIndexOfId + 1),
//   ];
// }
export function reinjectElementInArray(array: note[], newElement: note) {
  const prevIndex = array.findLastIndex((e) => e.id < newElement.id);
  return [
    ...array.slice(0, prevIndex + 1),
    newElement,
    ...array.slice(prevIndex + 1),
  ];
}
export function BGtype(uri: string) {
  if (uri.includes("/")) {
    return "img";
  }
  return "color";
}
export function replaceElementAtIndex<T>(
  array: T[],
  replaceIndex: number,
  newElement: T
) {
  return [
    ...array.slice(0, replaceIndex),
    newElement,
    ...array.slice(replaceIndex + 1),
  ];
}
export function removeElement<T>(array: T[], removeElement: T) {
  const removeIndex = array.indexOf(removeElement);
  return [...array.slice(0, removeIndex), ...array.slice(removeIndex + 1)];
}
export function removeObjectKey<T, K extends keyof T>(obj: T, removeKey: K) {
  const { [removeKey]: removedKey, ...newObj } = obj;
  return newObj;
}
export function replaceElementAtId(
  array: note[],
  replaceId: number,
  newElement: note
) {
  const arrayIndexOfId = array.findIndex((e) => e.id === replaceId);
  return [
    ...array.slice(0, arrayIndexOfId),
    newElement,
    ...array.slice(arrayIndexOfId + 1),
  ];
}
export function removeArrayKeyDuplicates<T, K extends keyof T>(
  array: T[],
  key: K
): T[K][] {
  return array.reduce((values, note) => {
    const keyValue = note[key];
    if (keyValue && !values.includes(keyValue)) {
      return [...values, keyValue];
    }
    return values;
  }, []);
}

export function excludeNotes(array: note[], elementsToRemove: number[]) {
  return recalculateId(
    array.filter((e: note) => !elementsToRemove.includes(e.id))
  );
}
export function excludeArrayElements<T>(array: T[], itemsToRemove: T[]) {
  return array.filter((e: T) => !itemsToRemove.includes(e));
}
export function recalculateId(array: note[]) {
  return array.map((item) => {
    const prevItemIndex = array.findLastIndex((e) => e.id < item.id);
    return {
      ...item,
      id: prevItemIndex + 2,
    };
  });
}
export function incrementId(array: note[]) {
  return array.map((item, i) => {
    return {
      ...item,
      id: i + 1,
    };
  });
}
export function uniqueIdCheck(array: note[]) {
  let passed = true;
  array.map((item, i) => {
    const prevIndex = array.findLastIndex((e) => e.id < item.id);
    if (prevIndex + 1 < i) {
      passed = false;
    }
  });
  return passed;
}
export function changeKeyValuesConditionaly<T, K extends keyof T>(
  array: T[],
  key: K,
  conditionOperator: "lower" | "greater" | "equal",
  conditionValue: T[K] | Date | null,
  newValue: T[K]
) {
  switch (conditionOperator) {
    case "lower":
      return array.map((item) => {
        if (item[key] < conditionValue) {
          return {
            ...item,
            [key]: newValue,
          };
        }
        return item;
      });
    case "equal":
      return array.map((item) => {
        if (item[key] === conditionValue) {
          return {
            ...item,
            [key]: newValue,
          };
        }
        return item;
      });
    case "greater":
      return array.map((item) => {
        if (item[key] > conditionValue) {
          return {
            ...item,
            [key]: newValue,
          };
        }
        return item;
      });
  }
}
export function range(start: number, end: number) {
  const range: number[] = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
}
export function sortStyles(styles: TextNoteStyle[]) {
  return styles.sort((a, b) => a?.interval?.start - b?.interval?.start);
}
export function dateTime(date: Date) {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const min =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const sec =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${day}.${month}.${year} ${hour}:${min}:${sec}`;
}
export function removeEmptySpace(value: string) {
  return value.replace(/\s+/g, " ").replace(/\n/g, "");
}
export function getFileExtension(file: string) {
  if (file.slice(0, file.lastIndexOf(".") + 1) + "json" === file) {
    return ".json";
  } else {
    return ".txt";
  }
}