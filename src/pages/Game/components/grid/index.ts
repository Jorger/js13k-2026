import "./styles.css";
import { Box, Brick, Rainbow, Tile, Unicorn } from "../index";
import { getElement } from "../../../../utils/getElement";
import { guid } from "../../../../utils/guid";
import { inlineStyles, setHtml } from "../../../../utils/helpers";
import {
  ILevel,
  ILevelCollider,
  IlevelData,
  ILevelFloor,
  ILevelGameObjectsMove,
} from "../../../../interfaces";
import Component from "../component";

const CLASS_NAMES = {
  GRID: "grid",
};

const BASE_NAME_ID = "grid";

class Grid extends Component {
  id: string;
  level: ILevel;
  floor: ILevelFloor;
  colliders: ILevelCollider;
  objectsMove: ILevelGameObjectsMove;
  element: HTMLElement | null;

  constructor(levelData: IlevelData) {
    super();

    console.log(levelData);

    this.id = `${BASE_NAME_ID}-${guid()}`;
    this.level = levelData.level;
    this.floor = levelData.floor;
    this.colliders = levelData.colliders;
    this.objectsMove = levelData.objectsMove;
    this.element = null;
  }

  get el(): HTMLElement | null {
    if (this.element) {
      return this.element;
    }

    this.element = getElement(this.id, this.element);

    return this.element;
  }

  render() {
    return /*html*/ `<div id="${this.id}" ${inlineStyles({ width: `${this.level.config.size * this.level.config.cols}px`, height: `${this.level.config.size * this.level.config.rows}px` })} class="${CLASS_NAMES.GRID}"></div>`;
  }

  children(): Component[] {
    const tiles = this.level.tiles.map((v) => new Tile(v));
    const bricks = this.level.bricks.map((v) => new Brick(v));
    const boxes = this.level.boxes.map((v) => new Box(v));
    const rainbows = this.level.rainbows.map((v) => new Rainbow(v));
    const uniconrs = this.level.uniconrs.map((v) => new Unicorn(v));

    return [...tiles, ...boxes, ...rainbows, ...uniconrs, ...bricks];
  }

  mount() {
    if (!this.el) {
      return;
    }

    const children = this.children();
    setHtml(this.el, children.map((child) => child.render()).join(""));

    children.forEach((child) => child.mount());
  }
}

export default Grid;
