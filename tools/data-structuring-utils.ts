import { note } from "../screens/note";
export function toggleArrayElement<T>(array: T[], value: T) {
  const indexOfValue = array.indexOf(value);
  if (indexOfValue === -1) {
    return [...array, value];
  }
  return removeElementAtIndex(array, indexOfValue);
}
export function toggleState<T>(initialValue: T, changeValue: T) {
  return (prevState: T) => {
    if (prevState === initialValue) {
      return changeValue;
    }
    if (prevState === changeValue) {
      return initialValue;
    }
  };
}
export function removeElementAtIndex<T>(array: T[], removeIndex: number) {
  return [...array.slice(0, removeIndex), ...array.slice(removeIndex + 1)];
}
export function generateUniqueFileId() {
  const time = new Date().getTime;
  const random = Math.floor(Math.random() * 10000);
  return `${time}-${random}`;
}
export function removeElementAtId(array: note[], removeId: number) {
  const arrayIndexOfId = array.findIndex((e) => e?.id === removeId);
  return [
    ...array.slice(0, arrayIndexOfId),
    ...array.slice(arrayIndexOfId + 1),
  ];
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

export function excludeElemnts(array: note[], elementsToRemove: number[]) {
  return array.filter((e: note) => !elementsToRemove.includes(e.id));
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
