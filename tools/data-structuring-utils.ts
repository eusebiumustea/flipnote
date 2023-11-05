export function removeElementAtIndex(array: any[], removeIndex: number) {
  switch (removeIndex) {
    case 0:
      return [...array.slice(1)];
    case array.length - 1:
      return [...array.slice(0, array.length - 1)];
    default:
      return [...array.slice(0, removeIndex), ...array.slice(removeIndex + 1)];
  }
}
export function replaceElementAtIndex(
  array: any[],
  replaceIndex: number,
  newElement: any
) {
  switch (replaceIndex) {
    case 0:
      return [newElement, ...array.slice(1)];
    case array.length - 1:
      return [...array.slice(0, array.length - 1), newElement];
    default:
      return [
        ...array.slice(0, replaceIndex),
        newElement,
        ...array.slice(replaceIndex + 1),
      ];
  }
}
