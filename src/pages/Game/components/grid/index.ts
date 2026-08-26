import "./styles.css";
import { Box, Tile, Unicorn, Rainbow, Brick } from "../index";
// import { ETypeBox, ETypeUnicorn } from "../../../../utils/constants";
import { getElement } from "../../../../utils/getElement";
import { guid } from "../../../../utils/guid";
import { inlineStyles, setHtml } from "../../../../utils/helpers";
import Component from "../component";
import { ILevel, IlevelData, ILevelMatrix } from "../../../../interfaces";

const CLASS_NAMES = {
  GRID: "grid",
};

const BASE_NAME_ID = "grid";

// const TEST_SIZE = 55;
// const TEST_SIZE = 75;

class Grid extends Component {
  id: string;
  level: ILevel;
  matrix: ILevelMatrix[];
  element: HTMLElement | null;

  constructor(levelData: IlevelData) {
    super();

    this.id = `${BASE_NAME_ID}-${guid()}`;
    this.level = levelData.level;
    this.matrix = levelData.matrix;
    this.element = null;

    console.log(this.matrix);
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

    // this.el.innerHTML = children.map((child) => child.render()).join("");

    children.forEach((child) => child.mount());
  }
}

export default Grid;

// import { getElement } from "../../../../utils/getElement";
// import { guid } from "../../../../utils/guid";
// import "./styles.css";

// const CLASS_NAMES = {
//   GRID: "grid",
// };

// const BASE_NAME_ID = "grid";

// class Grid {
//   id: string;
//   element: HTMLElement | null;

//   constructor() {
//     this.id = `${BASE_NAME_ID}-${guid()}`;
//     this.element = null;
//     console.log("Llega a grid");
//   }

//   get el(): HTMLElement | null {
//     if (this.element) {
//       return this.element;
//     }

//     this.element = getElement(this.id, this.element);

//     return this.element;
//   }

//   render() {
//     return /*html*/ `<div class="${CLASS_NAMES.GRID}"></div>`;
//   }

//   children() {
//     console.log("RENDERIZAR LOS HIJOS");
//   }

//   toString() {
//     return this.render();
//   }
// }

// export default Grid;
