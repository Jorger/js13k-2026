import "./styles.css";
import { classNames } from "../../../../utils/classNames";
import {
  GAME_OBJECT_CLASS,
  SHORT_CLASS_NAMES,
} from "../../../../utils/constants";
import { addClass, inlineStyles } from "../../../../utils/helpers";
import GameObject from "../base-component";
import type { IGameObject } from "../../../../interfaces";

const CLASS_NAMES = {
  RAINBOW: "rainbow",
  PICK_UP: "pick-up",
};

class Rainbow extends GameObject {
  constructor({ id, position, size }: IGameObject) {
    super({
      id,
      position,
      size,
    });
  }

  render() {
    const styles = {
      "--size": `${this.size}px`,
      left: `${this.position.x}px`,
      top: `${this.position.y}px`,
    };

    return /*html*/ `<div id="${this.idDom}" class="${classNames(SHORT_CLASS_NAMES.DF, SHORT_CLASS_NAMES.JC, SHORT_CLASS_NAMES.AI, GAME_OBJECT_CLASS, CLASS_NAMES.RAINBOW)}"${inlineStyles(styles)}>🌈</div>`;
  }

  pickUp() {
    addClass(this.el, CLASS_NAMES.PICK_UP);
  }
}

export default Rainbow;
