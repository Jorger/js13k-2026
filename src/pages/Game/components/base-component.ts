import { getElement } from "../../../utils/getElement";
import { guid } from "../../../utils/guid";
import { ICoordinate } from "../../../interfaces";
import Component from "./component";

const BASE_NAME_ID = "element";

abstract class GameObject extends Component {
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
    super();

    this.position = position;
    this.size = size;
    this.id = `${idPrefix}-${guid()}`;
    this.element = null;
  }

  get el(): HTMLElement | null {
    if (this.element) {
      return this.element;
    }

    this.element = getElement(this.id, this.element);

    return this.element;
  }

  abstract render(): string;

  toString() {
    return this.render();
  }
}

export default GameObject;
