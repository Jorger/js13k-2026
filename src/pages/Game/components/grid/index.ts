import "./styles.css";
import { Box, Brick, Rainbow, Tile, Unicorn } from "../index";
import { EDirections, INPUT_DIRECTION } from "../../../../utils/constants";
import { getElement } from "../../../../utils/getElement";
import { guid } from "../../../../utils/guid";
import {
  cloneDeep,
  inlineStyles,
  qs,
  setHtml,
} from "../../../../utils/helpers";
import Component from "../component";
import InputManager from "../../../../utils/InputManager";
import type {
  Direction,
  ILevel,
  IlevelData,
  IElementPosition,
  ILevelUnicorns,
  ILevelBoxes,
  ICoordinate,
  IElementsMove,
  TKey,
} from "../../../../interfaces";

const CLASS_NAMES = {
  GRID: "grid",
};

const BASE_NAME_ID = "grid";

// Filas -> Arriba y abjo
// columas -> Izquierda y derecha...

class Grid extends Component {
  /**
   * El id para identificar el elemento en el DOM...
   */
  id: string;

  /**
   * Hace referencia al elemento en el dom de la grilla...
   */
  element: HTMLElement | null = null;

  /**
   * La información del nivel que se renderiza en el DOM...
   */
  level: ILevel;

  /**
   * Referencia de los elementos de tipo piso...
   */
  floor: IElementPosition;

  /**
   * Referencia de los elementos tipo muro (bricks)...
   */
  walls: IElementPosition;

  /**
   * Listado de unicornios en el juego...
   */
  unicors: ILevelUnicorns | null = null;

  /**
   * Listado de cajas en el juego...
   */
  boxes: ILevelBoxes | null = null;

  /**
   * Listado de arcoiris en el juego...
   */
  rainbows: IElementPosition | null = null;

  /**
   * El listado de elementos que se moverán...
   */
  elementsMove: IElementsMove[] = [];

  /**
   * Refenrecia al input manager del juego (teclado ó swipe)...
   */
  inputManager: InputManager;

  /**
   * Para hacer referencia el elemento del intervalo...
   */
  timeoutId: ReturnType<typeof setTimeout> | null = null;

  // Temporal...
  tmpDebug: Element | null = null;

  constructor(levelData: IlevelData) {
    super();

    console.log(levelData);

    this.id = `${BASE_NAME_ID}-${guid()}`;
    this.level = levelData.level;
    this.floor = levelData.floor;
    this.walls = levelData.walls;

    /**
     * Se clona la información, ya que está será mutada en el juego...
     */
    this.rainbows = cloneDeep(levelData.rainbows);
    this.unicors = cloneDeep(levelData.unicorns);
    this.boxes = cloneDeep(levelData.boxes);

    console.log("UNICORS: ", this.unicors);
    console.log("BOXES: ", this.boxes);
    console.log("RAINBOWS: ", this.rainbows);

    this.inputManager = new InputManager(this.handleMoveElement.bind(this));
  }

  handleMoveElement(direction: Direction | null) {
    if (!direction || !this.unicors || this.elementsMove.length !== 0) return;

    // console.log("VALORES A BUSCAR: ", INPUT_DIRECTION[direction]);

    if (this.tmpDebug) {
      this.tmpDebug.textContent = direction ?? "";
    }

    const evaluationOrder = this.getOrderEvaluationUnicorns(direction);

    // console.log("Direction:", direction);
    // console.log(this.unicors);

    evaluationOrder.forEach((key) =>
      this.unicornCanMove(key, INPUT_DIRECTION[direction]),
    );

    if (this.elementsMove.length !== 0) {
      this.timeoutId = setTimeout(() => {
        this.elementsMove = [];
        console.log("AHORA EVALUA LOS SIGUIENTES Y LOS QUE CAEN...");
        console.log("DIRECIÓN: ", this.inputManager.currentDirection);
      }, 5000);
    }

    // for (const key of evaluationOrder) {
    //   // const unicorn = this.unicors[key];
    //   this.unicornCanMove(key, INPUT_DIRECTION[direction]);

    //   // console.log({ canMove });
    //   // const [row, col] = this.unicors[key];
    //   // console.log({ row, col });
    //   // const
    //   // console.log(unicorn);
    // }

    // Move player...
  }

  /**
   * Para determinar el orden de evaluación que se hace de los unicorns,
   * este orden ayud a que si hay un unicornio adelante de otro, ese ya se debió
   * haber evaluado...
   * @param direction
   * @returns
   */
  getOrderEvaluationUnicorns(direction: Direction) {
    if (!this.unicors) {
      return [];
    }

    const index =
      direction === EDirections.left || direction === EDirections.right ? 0 : 1;

    const isAscending =
      direction === EDirections.left || direction === EDirections.up;

    return Object.keys(this.unicors)
      .map((id) => ({
        id,
        value: this.unicors?.[id][index] ?? 0,
      }))
      .sort((a, b) => (isAscending ? a.value - b.value : b.value - a.value))
      .map(({ id }) => id);
  }

  unicornCanMove(unicornKey: string, nextCoordinate: ICoordinate) {
    // if (!this.unicors) return;

    // console.log({ unicornKey });

    const [x, y] = this.unicors?.[unicornKey] || [0, 0];
    const newPosition: ICoordinate = {
      x: x + nextCoordinate.x,
      y: y + nextCoordinate.y,
    };

    console.log({
      nextCoordinate,
      unicornKey,
      x,
      y,
    });

    // Hay un muro...
    if (this.walls[this.getKey(newPosition)]) return;

    // Saber si hay otro unicornio...

    this.elementsMove.push({
      id: unicornKey,
      type: 1,
      coordinate: newPosition,
    });

    console.log("this.elementsMove: ", this.elementsMove);

    // return true;

    // There is a wall

    // Saber si en la posición hay un muro...
  }

  getKey(coordinate: ICoordinate): TKey {
    return `${coordinate.x}-${coordinate.y}`;
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

  /**
   * Renderizar los elementos dentro de la grilla, dependiendo del nivel..
   * @returns
   */
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

    this.inputManager.mount();

    this.tmpDebug = qs(".debug");

    // setInterval(() => {
    //   // console.log("EN EL INTERVALO: ", this.keyManager?.currentDirection);
    //   console.log("EN EL INTERVALO: ", this.inputManager.currentDirection);
    // }, 1000);
  }

  unmount() {
    // const children = this.children();
    // children.forEach((child) => child.unmount?.());
    // setHtml(this.el, "");
    this.inputManager.unmount();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

export default Grid;
