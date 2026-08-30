import "./styles.css";
import { inlineStyles } from "../../../../utils/helpers";
import GameObject from "../base-component";
import type { IBox, TTypeBox } from "../../../../interfaces";
import { classNames } from "../../../../utils/classNames";
import {
  GAME_OBJECT_CLASS,
  ETypeBox,
  SHORT_CLASS_NAMES,
} from "../../../../utils/constants";

const CLASS_NAMES = {
  BOX: "box",
};

class Box extends GameObject {
  label: number;
  type: TTypeBox;

  constructor({ id, position, size, label = 1, type = ETypeBox.NORMAL }: IBox) {
    super({
      id,
      position,
      size,
    });

    this.type = type;
    this.label = label;
  }

  render() {
    const styles = {
      "--size": `${this.size}px`,
      left: `${this.position.x}px`,
      top: `${this.position.y}px`,
    };

    return /*html*/ `<div id="${this.id}" class="${classNames(SHORT_CLASS_NAMES.DF, SHORT_CLASS_NAMES.JC, SHORT_CLASS_NAMES.AI, GAME_OBJECT_CLASS, CLASS_NAMES.BOX, this.type.toLowerCase())}"${inlineStyles(styles)}><span>${this.label}</span></div>`;
  }
}

export default Box;
