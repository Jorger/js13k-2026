import "./styles.css";
import { classNames } from "../../../../utils/classNames";
import {
  GAME_OBJECT_CLASS,
  SHORT_CLASS_NAMES,
} from "../../../../utils/constants";
import { inlineStyles } from "../../../../utils/helpers";
import GameObject from "../base-component";
import type { IGameObject } from "../../../../interfaces";

const CLASS_NAMES = {
  RAINBOW: "rainbow",
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

    return /*html*/ `<div id="${this.id}" class="${classNames(SHORT_CLASS_NAMES.DF, SHORT_CLASS_NAMES.JC, SHORT_CLASS_NAMES.AI, GAME_OBJECT_CLASS, CLASS_NAMES.RAINBOW)}"${inlineStyles(styles)}>🌈</div>`;
  }
}

export default Rainbow;
