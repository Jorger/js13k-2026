import { ICoordinate } from "../interfaces";
import { guid } from "../utils/guid";
import { qs } from "../utils/helpers";

const BASE_NAME_ID = "element";

abstract class GameObject {
  element: HTMLElement | null;
  size: number;
  position: ICoordinate;
  id: string;

  constructor({
    position,
    size,
    idPrefix = BASE_NAME_ID,
  }: {
    position: ICoordinate;
    size: number;
    idPrefix?: string;
  }) {
    this.position = position;
    this.size = size;
    this.id = `${idPrefix}-${guid()}`;
    this.element = null;
  }

  get el(): HTMLElement | null {
    if (this.element) {
      return this.element;
    }

    const element = qs(`#${this.id}`) as HTMLElement;

    if (!element) {
      return null;
    }

    this.element = element;

    return element;
  }

  abstract render(): string;

  toString() {
    return this.render();
  }
}

export default GameObject;
