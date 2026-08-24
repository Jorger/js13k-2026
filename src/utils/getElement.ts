import { qs } from "./helpers";

export const getElement = (
  id: string,
  element: HTMLElement | null,
): HTMLElement | null => {
  if (element) {
    return element;
  }

  const foundElement = qs(`#${id}`) as HTMLElement;

  return foundElement || null;
};
