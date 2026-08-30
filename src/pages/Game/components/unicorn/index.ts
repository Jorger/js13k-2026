import "./styles.css";
import { classNames } from "../../../../utils/classNames";
import { addClass, addStyle, inlineStyles } from "../../../../utils/helpers";
import {
  ETypeUnicorn,
  GAME_OBJECT_CLASS,
  SHORT_CLASS_NAMES,
} from "../../../../utils/constants";
import GameObject from "../base-component";
import type {
  ICoordinate,
  IUnicorn,
  TTypeUnicorn,
} from "../../../../interfaces";

const CLASS_NAMES = {
  UNICORN: "unicorn",
  SINK: "sink",
};

class Unicorn extends GameObject {
  type: TTypeUnicorn;

  constructor({ id, position, size, type = ETypeUnicorn.NORMAL }: IUnicorn) {
    super({
      id,
      position,
      size,
    });

    this.type = type;
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
    addStyle(this.el, { left: `${position.x}px`, top: `${position.y}px` });
  }

  sink() {
    addClass(this.el, CLASS_NAMES.SINK);
  }
}

export default Unicorn;
