import { note } from "../screens/note";

export function toggleArrayElement<T>(array: T[], value: T) {
  const indexOfValue = array.indexOf(value);
  if (indexOfValue === -1) {
    return [...array, value];
  }
  return removeElementAtIndex(array, indexOfValue);
}

export function removeElementAtIndex(array: any[], removeIndex: number) {
  return [...array.slice(0, removeIndex), ...array.slice(removeIndex + 1)];
}
export function removeElementAtId(array: any[], removeId: number) {
  const arrayIndexOfId = array.findIndex((e) => e?.id === removeId);
  return [
    ...array.slice(0, arrayIndexOfId),
    ...array.slice(arrayIndexOfId + 1),
  ];
}
export function replaceElementAtIndex(
  array: any[],
  replaceIndex: number,
  newElement: any
) {
  return [
    ...array.slice(0, replaceIndex),
    newElement,
    ...array.slice(replaceIndex + 1),
  ];
}
export function replaceElementAtId(
  array: any[],
  replaceId: number,
  newElement: any
) {
  const arrayIndexOfId = array.findIndex((e) => e?.id === replaceId);
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

export function excludeElemnts<T>(array: T[], elementsToRemove: T[]) {
  return array.filter((e) => !elementsToRemove.includes(e));
}
