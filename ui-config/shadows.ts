import { dark } from "../constants";

export function shadows(theme?: typeof dark) {
  return {
    elevation: 7,
    shadowColor: theme?.onPrimary || "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
  };
}
