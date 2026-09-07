import { getElement } from "../../../utils/getElement";
import { ICoordinate } from "../../../interfaces";
import Component from "./component";

abstract class GameObject extends Component {
  element: HTMLElement | null;
  size: number;
  position: ICoordinate;
  id: string;
  idDom: string;

  constructor({
    position,
    size,
    id,
  }: {
    position: ICoordinate;
    size: number;
    id: string;
  }) {
    super();

    this.position = position;
    this.size = size;
    this.id = id;
    this.idDom = `e-${id}`;
    this.element = null;
  }

  get el(): HTMLElement | null {
    if (this.element) {
      return this.element;
    }

    this.element = getElement(this.idDom, this.element);

    return this.element;
  }

  abstract render(): string;

  toString() {
    return this.render();
  }
}

export default GameObject;
