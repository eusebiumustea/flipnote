import { NotePreviewTypes, TextNoteStyle, Note } from "../screens/note";
export function toggleArrayElement<T>(array: T[], value: T) {
  const indexOfValue = array.indexOf(value);
  if (indexOfValue === -1) {
    return [...array, value];
  }
  return removeElementAtIndex(array, indexOfValue);
}
export function areObjectsEqual<o>(obj1: o, obj2: o): boolean {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      return false;
    }
  }
  return true;
}

export function formatBytes(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 1 || bytes === 0) return bytes + " Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
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
export function toggleObjectKeyValue<O, K extends keyof O, V>(
  object: O,
  key: K,
  value: V
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
export function reinjectElementInArray(array: Note[], newElement: Note) {
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
  if (replaceIndex > -1) {
    return [
      ...array.slice(0, replaceIndex),
      newElement,
      ...array.slice(replaceIndex + 1),
    ];
  }
  return array;
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
  array: NotePreviewTypes[],
  replaceId: number,
  newElement: NotePreviewTypes
) {
  const arrayIndexOfId = array.findIndex((e) => e.id === replaceId);
  if (arrayIndexOfId > -1) {
    return [
      ...array.slice(0, arrayIndexOfId),
      newElement,
      ...array.slice(arrayIndexOfId + 1),
    ];
  }
  return [newElement, ...array];
}
export function removeElementAtId(
  array: NotePreviewTypes[],
  replaceId: number
) {
  const arrayIndexOfId = array.findIndex((e) => e.id === replaceId);
  if (arrayIndexOfId > -1) {
    return [
      ...array.slice(0, arrayIndexOfId),
      ...array.slice(arrayIndexOfId + 1),
    ];
  }
  return array;
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

export function excludeNotes(array: Note[], elementsToRemove: number[]) {
  return recalculateId(
    array.filter((e: Note) => !elementsToRemove.includes(e.id))
  );
}
export function excludeArrayElements<T>(array: T[], itemsToRemove: T[]) {
  return array.filter((e: T) => !itemsToRemove.includes(e));
}
export function recalculateId(array: Note[]) {
  return array.map((item) => {
    const prevItemIndex = array.findLastIndex((e) => e.id < item.id);
    return {
      ...item,
      id: prevItemIndex + 2,
    };
  });
}
export function incrementId(array: Note[]) {
  return array.map((item, i) => {
    return {
      ...item,
      id: i + 1,
    };
  });
}
export function uniqueIdCheck(array: Note[]) {
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
