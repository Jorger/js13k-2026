import "./styles.css";
import { inlineStyles } from "../../utils/helpers";
import GameObject from "../base-component";
import type { IGameObject } from "../../interfaces";
import { classNames } from "../../utils/classNames";
import { GAME_OBJECT_CLASS } from "../../utils/constants";

const CLASS_NAMES = {
  BRICK: "brick",
};

const BASE_NAME_ID = "brick";

class Brick extends GameObject {
  constructor({ position, size }: IGameObject) {
    super({
      position,
      size,
      idPrefix: BASE_NAME_ID,
    });
  }

  render() {
    const styles = {
      "--size": `${this.size}px`,
      left: `${this.position.x}px`,
      top: `${this.position.y}px`,
    };

    return /*html*/ `
      <div
        id="${this.id}"
        class="${classNames(GAME_OBJECT_CLASS, CLASS_NAMES.BRICK)}"
        ${inlineStyles(styles)}
      ></div>
    `;
  }
}

export default Brick;
