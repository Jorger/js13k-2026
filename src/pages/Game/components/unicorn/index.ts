import "./styles.css";
import { classNames } from "../../../../utils/classNames";
import { inlineStyles } from "../../../../utils/helpers";
import {
  ETypeUnicorn,
  GAME_OBJECT_CLASS,
  SHORT_CLASS_NAMES,
} from "../../../../utils/constants";
import GameObject from "../base-component";
import type { IUnicorn, TTypeUnicorn } from "../../../../interfaces";

const CLASS_NAMES = {
  UNICORN: "unicorn",
};

const BASE_NAME_ID = "unicorn";

class Unicorn extends GameObject {
  type: TTypeUnicorn;

  constructor({ position, size, type = ETypeUnicorn.NORMAL }: IUnicorn) {
    super({
      position,
      size,
      idPrefix: BASE_NAME_ID,
    });

    this.type = type;
  }

  render() {
    const styles = {
      "--size": `${this.size}px`,
      left: `${this.position.x}px`,
      top: `${this.position.y}px`,
    };

    return /*html*/ `<div id="${this.id}" ${inlineStyles(styles)} class="${classNames(SHORT_CLASS_NAMES.DF, SHORT_CLASS_NAMES.JC, SHORT_CLASS_NAMES.AI, GAME_OBJECT_CLASS, CLASS_NAMES.UNICORN, this.type.toLowerCase())}"></div>`;
  }
}

export default Unicorn;
