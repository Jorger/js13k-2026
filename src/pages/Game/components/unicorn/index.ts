import "./styles.css";
import { classNames } from "../../../../utils/classNames";
import {
  addClass,
  addStyle,
  inlineStyles,
  removeClass,
} from "../../../../utils/helpers";
import {
  EDirections,
  ETypeUnicorn,
  GAME_OBJECT_CLASS,
  SHORT_CLASS_NAMES,
} from "../../../../utils/constants";
import GameObject from "../base-component";
import type {
  Direction,
  ICoordinate,
  IUnicorn,
  TTypeUnicorn,
} from "../../../../interfaces";

const CLASS_NAMES = {
  UNICORN: "unicorn",
  SINK: "sink",
  MOVE: "move",
};

class Unicorn extends GameObject {
  type: TTypeUnicorn;
  direction: Direction = EDirections.left;

  constructor({
    id,
    position,
    size,
    type = ETypeUnicorn.NORMAL,
    direction = EDirections.left,
  }: IUnicorn) {
    super({
      id,
      position,
      size,
    });

    this.type = type;
    this.direction = direction;
  }

  render() {
    const styles = {
      "--size": `${this.size}px`,
      left: `${this.position.x}px`,
      top: `${this.position.y}px`,
    };

    return /*html*/ `<div id="${this.idDom}" ${inlineStyles(styles)} class="${classNames(SHORT_CLASS_NAMES.DF, SHORT_CLASS_NAMES.JC, GAME_OBJECT_CLASS, CLASS_NAMES.UNICORN, this.type.toLowerCase())}"></div>`;
  }

  move(position: ICoordinate) {
    this.direction === EDirections.right
      ? addClass(this.el, EDirections.right)
      : removeClass(this.el, EDirections.right);

    addClass(this.el, CLASS_NAMES.MOVE);
    addStyle(this.el, { left: `${position.x}px`, top: `${position.y}px` });
  }

  sink() {
    addClass(this.el, CLASS_NAMES.SINK);
  }

  idle() {
    removeClass(this.el, CLASS_NAMES.MOVE);
  }
}

export default Unicorn;
