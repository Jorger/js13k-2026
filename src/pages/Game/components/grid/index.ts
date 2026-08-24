import "./styles.css";
import { Box, Tile, Unicorn, Rainbow, Brick } from "../index";
import { ETypeBox, ETypeUnicorn } from "../../../../utils/constants";
import { getElement } from "../../../../utils/getElement";
import { guid } from "../../../../utils/guid";
import { inlineStyles, setHtml } from "../../../../utils/helpers";
import Component from "../component";

const CLASS_NAMES = {
  GRID: "grid",
};

const BASE_NAME_ID = "grid";

// const TEST_SIZE = 55;
const TEST_SIZE = 75;

class Grid extends Component {
  id: string;
  element: HTMLElement | null;

  constructor(levelNumber: number) {
    super();

    this.id = `${BASE_NAME_ID}-${guid()}`;
    this.element = null;

    console.log("LEVEL NUMBER: ", levelNumber);
  }

  get el(): HTMLElement | null {
    if (this.element) {
      return this.element;
    }

    this.element = getElement(this.id, this.element);

    return this.element;
  }

  render() {
    return /*html*/ `
      <div
        id="${this.id}"
        ${inlineStyles({ width: `${TEST_SIZE * 5}px`, height: `${TEST_SIZE * 6}px` })}
        class="${CLASS_NAMES.GRID}"
      ></div>
    `;
  }

  children(): Component[] {
    // return [
    //   new Tile({
    //     position: { x: TEST_SIZE * 2, y: 0 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 5, y: 0 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE, y: TEST_SIZE },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 2, y: TEST_SIZE },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 3, y: TEST_SIZE },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 4, y: TEST_SIZE },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 5, y: TEST_SIZE },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 3, y: TEST_SIZE * 2 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: 0, y: TEST_SIZE * 3 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 1, y: TEST_SIZE * 3 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 2, y: TEST_SIZE * 3 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 3, y: TEST_SIZE * 3 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 4, y: TEST_SIZE * 3 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 1, y: TEST_SIZE * 4 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 2, y: TEST_SIZE * 4 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 4, y: TEST_SIZE * 4 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 5, y: TEST_SIZE * 4 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 6, y: TEST_SIZE * 4 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 1, y: TEST_SIZE * 5 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 2, y: TEST_SIZE * 5 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 4, y: TEST_SIZE * 5 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 6, y: TEST_SIZE * 5 },
    //     size: TEST_SIZE,
    //   }),
    //   //inici
    //   new Tile({
    //     position: { x: TEST_SIZE * 1, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 2, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 3, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 4, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 5, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Tile({
    //     position: { x: TEST_SIZE * 6, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Rainbow({
    //     position: { x: TEST_SIZE * 2, y: 0 },
    //     size: TEST_SIZE,
    //   }),
    //   new Rainbow({
    //     position: { x: TEST_SIZE * 5, y: 0 },
    //     size: TEST_SIZE,
    //   }),
    //   new Brick({
    //     position: { x: 0, y: TEST_SIZE * 3 },
    //     size: TEST_SIZE,
    //   }),
    //   new Brick({
    //     position: { x: TEST_SIZE * 2, y: TEST_SIZE * 4 },
    //     size: TEST_SIZE,
    //   }),
    //   new Brick({
    //     position: { x: TEST_SIZE * 5, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Unicorn({
    //     position: { x: TEST_SIZE * 6, y: TEST_SIZE * 6 },
    //     size: TEST_SIZE,
    //   }),
    //   new Unicorn({
    //     position: { x: TEST_SIZE * 2, y: TEST_SIZE * 5 },
    //     size: TEST_SIZE,
    //     type: ETypeUnicorn.INVERT,
    //   }),
    // ];
    return [
      new Tile({
        position: { x: TEST_SIZE * 2, y: 0 },
        size: TEST_SIZE,
      }),
      new Tile({
        position: { x: TEST_SIZE, y: TEST_SIZE },
        size: TEST_SIZE,
      }),
      new Tile({
        position: { x: TEST_SIZE * 2, y: TEST_SIZE },
        size: TEST_SIZE,
      }),
      new Tile({
        position: { x: TEST_SIZE, y: TEST_SIZE * 2 },
        size: TEST_SIZE,
      }),
      new Tile({
        position: { x: TEST_SIZE * 2, y: TEST_SIZE * 2 },
        size: TEST_SIZE,
      }),
      new Tile({
        position: { x: TEST_SIZE * 3, y: TEST_SIZE * 2 },
        size: TEST_SIZE,
      }),

      new Tile({
        position: { x: 0, y: TEST_SIZE * 3 },
        size: TEST_SIZE,
      }),

      new Tile({
        position: { x: TEST_SIZE, y: TEST_SIZE * 3 },
        size: TEST_SIZE,
      }),
      new Tile({
        position: { x: TEST_SIZE * 2, y: TEST_SIZE * 3 },
        size: TEST_SIZE,
      }),
      new Tile({
        position: { x: TEST_SIZE * 3, y: TEST_SIZE * 3 },
        size: TEST_SIZE,
      }),

      new Tile({
        position: { x: TEST_SIZE, y: TEST_SIZE * 4 },
        size: TEST_SIZE,
      }),

      new Tile({
        position: { x: TEST_SIZE * 2, y: TEST_SIZE * 4 },
        size: TEST_SIZE,
      }),

      new Tile({
        position: { x: TEST_SIZE * 3, y: TEST_SIZE * 4 },
        size: TEST_SIZE,
      }),

      new Tile({
        position: { x: TEST_SIZE * 4, y: TEST_SIZE * 4 },
        size: TEST_SIZE,
      }),

      new Tile({
        position: { x: TEST_SIZE, y: TEST_SIZE * 5 },
        size: TEST_SIZE,
      }),

      new Brick({
        position: { x: TEST_SIZE, y: 0 },
        size: TEST_SIZE,
      }),
      new Brick({
        position: { x: 0, y: 0 },
        size: TEST_SIZE,
      }),
      new Brick({
        position: { x: 0, y: TEST_SIZE },
        size: TEST_SIZE,
      }),

      new Brick({
        position: { x: TEST_SIZE * 3, y: TEST_SIZE * 2 },
        size: TEST_SIZE,
      }),

      new Brick({
        position: { x: 0, y: TEST_SIZE * 2 },
        size: TEST_SIZE,
      }),

      new Brick({
        position: { x: 0, y: TEST_SIZE * 3 },
        size: TEST_SIZE,
      }),

      new Brick({
        position: { x: TEST_SIZE, y: TEST_SIZE * 5 },
        size: TEST_SIZE,
      }),

      new Box({
        position: { x: TEST_SIZE, y: TEST_SIZE * 3 },
        size: TEST_SIZE,
        type: ETypeBox.UNDISTRUCTIVE,
        label: 2,
      }),

      new Box({
        position: { x: TEST_SIZE * 3, y: TEST_SIZE * 3 },
        size: TEST_SIZE,
        label: 2,
      }),

      new Box({
        position: { x: TEST_SIZE * 3, y: TEST_SIZE * 4 },
        size: TEST_SIZE,
        type: ETypeBox.UNDISTRUCTIVE,
      }),

      new Rainbow({
        position: { x: TEST_SIZE * 4, y: TEST_SIZE * 4 },
        size: TEST_SIZE,
      }),

      new Unicorn({
        position: { x: TEST_SIZE, y: TEST_SIZE },
        size: TEST_SIZE,
      }),

      new Unicorn({
        position: { x: TEST_SIZE, y: TEST_SIZE * 4 },
        size: TEST_SIZE,
        type: ETypeUnicorn.INVERT,
      }),
    ];
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
