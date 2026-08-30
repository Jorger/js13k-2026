import "./styles.css";
import { Box, Brick, Rainbow, Tile, Unicorn } from "../index";
import {
  EDirections,
  ETypeBox,
  INPUT_DIRECTION,
  OPOSITE_DIRECTION,
  SPEED_MOVEMENT,
} from "../../../../utils/constants";
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
  IUnicornGame,
  IBoxGame,
  IRainbowGame,
  TInputDirection,
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
   * La data base del nivel...
   */
  levelData: IlevelData | null = null;

  /**
   * La información del nivel que se renderiza en el DOM...
   */
  // level: ILevel;

  /**
   * Referencia de los elementos de tipo piso...
   */
  // floor: IElementPosition;

  /**
   * Referencia de los elementos tipo muro (bricks)...
   */
  // walls: IElementPosition;

  /**
   * Listado de unicornios en el juego...
   */
  unicorns: IUnicornGame | null = null;

  /**
   * Listado de cajas en el juego...
   */
  boxes: IBoxGame | null = null;

  /**
   * Listado de arcoiris en el juego...
   */
  rainbows: IRainbowGame | null = null;

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

  /**
   * Para saber si el juego ha acabado...
   */
  isGameOver = false;

  /**
   * Para saber si hay un input nuevo..
   */
  // isInPut = false;

  // Temporal...
  tmpDebug: Element | null = null;

  constructor(levelData: IlevelData) {
    super();

    // console.log(levelData);

    this.levelData = levelData;
    this.id = `${BASE_NAME_ID}-${guid()}`;
    // this.level = levelData.level;
    // this.floor = levelData.floor;
    // this.walls = levelData.walls;

    /**
     * Se clona la información, ya que está será mutada en el juego...
     */
    // this.rainbows = cloneDeep(levelData.rainbows);
    // this.unicors = cloneDeep(levelData.unicorns);
    // this.boxes = cloneDeep(levelData.boxes);

    // console.log("UNICORS: ", this.unicors);
    // console.log("BOXES: ", this.boxes);
    // console.log("RAINBOWS: ", this.rainbows);

    this.inputManager = new InputManager(this.handleMoveElement.bind(this));
  }

  handleMoveElement(direction: Direction | null) {
    if (this.isGameOver) return;

    // console.log({
    //   direction,
    //   isValid: this.isValidLevel,
    //   elementsMove: this.elementsMove,
    // });

    if (!direction || !this.isValidLevel || this.elementsMove.length !== 0) {
      return;
    }

    if (this.tmpDebug) {
      this.tmpDebug.textContent = direction ?? "";
    }

    this.validateMovement(direction);

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

  validateMovement(direction: Direction) {
    // console.log("VALORES A BUSCAR: ", INPUT_DIRECTION[direction]);

    // const evaluationOrder = this.getOrderEvaluationUnicorns(direction);
    // console.log({ direction, evaluationOrder });

    // console.log("Direction:", direction);
    // console.log(this.unicors);

    this.getOrderEvaluationUnicorns(direction).forEach((key) =>
      this.unicornCanMove(key, direction),
    );

    // TODO: moverlo a una función
    this.moveElements();
  }

  get isValidLevel() {
    return !!(this.unicorns || this.rainbows);
  }

  moveElements() {
    if (this.elementsMove.length === 0) return;

    const { size } = this.levelData!.level.config;

    // const { id, type, coordinate }
    for (let i = 0; i < this.elementsMove.length; i++) {
      const { id, type, coordinate } = this.elementsMove[i];

      const position: ICoordinate = {
        x: coordinate.x * size,
        y: coordinate.y * size,
      };

      // Unicornio...
      if (type === 1) {
        this.unicorns![id].obj.move(position);
        this.unicorns![id].position = coordinate;
      }
    }
    // if (this.elementsMove.length !== 0) {

    this.timeoutId = setTimeout(
      this.validateEndMovement.bind(this),
      SPEED_MOVEMENT,
    );
  }

  validateEndMovement() {
    // Primero saber si ha caído al agua...
    const isUnicornsOnFloor = this.elementIsOnFloor();

    if (!isUnicornsOnFloor) {
      this.isGameOver = true;
      return;
    }

    // this.elementsMove = [];
    // console.log("AHORA EVALUA LOS SIGUIENTES Y LOS QUE CAEN...", {
    //   isUnicornsOnFloor,
    // });
    // console.log("DIRECIÓN: ", this.inputManager.currentDirection);

    this.elementsMove = [];

    if (this.inputManager.currentDirection) {
      this.validateMovement(this.inputManager.currentDirection);
    }
  }

  elementIsOnFloor() {
    let isOnfloor = true;
    const { floor } = this.levelData!;

    for (let i = 0; i < this.elementsMove.length; i++) {
      const { id, coordinate, type } = this.elementsMove[i];

      if (!floor[this.getKey(coordinate)]) {
        if (type === 1) {
          // Indicar que ahora ha caído en el agua...
          this.unicorns![id].obj.sink();

          // Sólo pasa cuando es unicornio, si cae una caja no pasa nada...
          isOnfloor = false;
        }
      }
    }

    return isOnfloor;
  }

  /**
   * Para determinar el orden de evaluación que se hace de los unicorns,
   * este orden ayud a que si hay un unicornio adelante de otro, ese ya se debió
   * haber evaluado...
   * @param direction
   * @returns
   */
  getOrderEvaluationUnicorns(direction: Direction) {
    // if (!this.unicorns) {
    //   return [];
    // }

    const index =
      direction === EDirections.left || direction === EDirections.right ? 0 : 1;

    const isAscending =
      direction === EDirections.left || direction === EDirections.up;

    return Object.keys(this.unicorns!)
      .map((id) => ({
        id,
        value: this.unicorns![id].position[index === 0 ? "x" : "y"] ?? 0,
      }))
      .sort((a, b) => (isAscending ? a.value - b.value : b.value - a.value))
      .map(({ id }) => id);
  }

  unicornCanMove(unicornKey: string, direction: Direction) {
    const { walls } = this.levelData!;

    // if (!this.unicors) return;

    // console.log({ unicornKey });
    const nextCoordinate = INPUT_DIRECTION[direction];
    const position = this.unicorns![unicornKey].position;

    const newPosition: ICoordinate = {
      x: position.x + nextCoordinate.x,
      y: position.y + nextCoordinate.y,
    };

    // console.log({
    //   nextCoordinate,
    //   unicornKey,
    //   position,
    //   newPosition,
    // });

    /**
     * Validar si hay un muro adelante
     */

    // Hay un muro...
    if (walls[this.getKey(newPosition)]) return;

    let canMove = true;

    /**
     * Validar si hay una caja en esa posición...
     */

    // const isBox = Object.keys(this.boxes!).find(
    //   (v) =>
    //     this.boxes![v].isVisible &&
    //     this.boxes![v].position.x === newPosition.x &&
    //     this.boxes![v].position.y === newPosition.y,
    // );

    const isBox = this.getBoxPosition(newPosition);

    /**
     * Si hay una caja, así que se debe hacer las validaciones de las cajas...
     */
    if (isBox) {
      // console.log("ES UNA CAJA QUE EXISTE EN ESA UBICACIÓN!!");
      const box = this.boxes![isBox];
      const { obj } = box;

      /**
       * EL label es el número de unicorns que se necesitan para acciona la caja...
       */
      const { label, type } = obj;
      const totalUnicorns = this.validateNumberUnicorns(isBox, direction);

      console.log({ totalUnicorns, label });

      canMove = totalUnicorns >= label;

      /**
       * Es válido no ha qye hacer alguna validación extra...
       */
      // if (!meetsCondition) {
      //   meetsCondition = this.validateNumberUnicorns(isBox, label, direction);
      //   console.log("REQUIERE MÁS DE UN UNICORNIO...");
      // }

      // console.log(isBox);

      if (canMove) {
        if (type === ETypeBox.NORMAL) {
          obj.explode();
          this.boxes![isBox].isVisible = false;

          // canMove = true;
        } else {
          // Saber si a donde se va a mover la caja se puede...
          // const boxPosition = box.position;
          // this.

          // const newPositionBox: ICoordinate = {
          //   x: boxPosition.x + nextCoordinate.x,
          //   y: boxPosition.y + nextCoordinate.y,
          // };

          // // Primero saber si hay un muro...
          // canMove = !!walls[this.getKey(newPositionBox)];

          // // No hay muro...
          // if (canMove) {
          //   // Ahora saber si hay una caja...
          //   const isBoxPosition = this.getBoxPosition(newPositionBox);

          //   if (isBoxPosition) {
          //     const box = this.boxes![isBox];
          //     const { obj } = box;
          //     totalUnicorns
          //   }
          // }

          console.log("SE DEBE MOVER LA CAJA");
        }
      }
    }

    if (!canMove) return;

    /**
     * Ahora saber si hay otro unicornio y si es así saber si ya está dentro de los elementos que
     * se van a mover, por lo que se interpreta qeu la posición estará dosponible...
     */
    const isUnicorn = Object.keys(this.unicorns!).find(
      (v) =>
        v !== unicornKey &&
        this.unicorns![v].isVisible &&
        this.unicorns![v].position.x === newPosition.x &&
        this.unicorns![v].position.y === newPosition.y,
    );

    /**
     * Si hay un unicornio en esa posición, por lo que se debe validar si está en e array de movimiento...
     */

    // console.log("HAY UN UNICORNIO?: ", isUnicorn);

    // console.log("ESTA LIBRE A DONDE SE QUIERE MOVER EL UNICORNIO!!", {
    //   unicornKey,
    //   position,
    //   newPosition,
    //   nextCoordinate,
    // });

    /**
     * Si hay un unicornio, se valida si el unicornio ya estaba en el array de elementos a mover...
     */
    if (isUnicorn) {
      canMove = !!this.elementsMove.find((v) => v.id === isUnicorn);
    }

    // Saber si hay otro unicornio...

    if (canMove) {
      this.elementsMove.push({
        id: unicornKey,
        type: 1,
        coordinate: newPosition,
      });
    }

    // console.log("elementsMove: ", this.elementsMove);

    // console.log("this.elementsMove: ", this.elementsMove);

    // return true;

    // There is a wall

    // Saber si en la posición hay un muro...
  }

  // moveMultipleBoxes(
  //   basePosition: ICoordinate,
  //   nextCoordinate: TInputDirection,
  // ) {}

  getBoxPosition(position: ICoordinate) {
    return Object.keys(this.boxes!).find(
      (v) =>
        this.boxes![v].isVisible &&
        this.boxes![v].position.x === position.x &&
        this.boxes![v].position.y === position.y,
    );
  }

  validateNumberUnicorns(boxKey: string, direction: Direction) {
    const box = this.boxes![boxKey];
    const newPosition = cloneDeep(box.position);
    const directionEvaluate = OPOSITE_DIRECTION[direction];
    const increaseDirection = INPUT_DIRECTION[directionEvaluate];
    const listUnicorns = Object.keys(this.unicorns!);
    let totalUniconrs = 0;

    while (this.isCoordinateInRange(newPosition)) {
      // Validar si en la nueva posición a un unicornio...
      newPosition.x = newPosition.x + increaseDirection.x;
      newPosition.y = newPosition.y + increaseDirection.y;

      const isUnicorn = listUnicorns.find(
        (v) =>
          this.unicorns![v].position.x === newPosition.x &&
          this.unicorns![v].position.y === newPosition.y,
      );

      if (isUnicorn) {
        totalUniconrs++;
      } else {
        break;
      }
    }

    return totalUniconrs;
  }

  isCoordinateInRange(coordinate: ICoordinate) {
    const { config } = this.levelData!.level;
    const { rows, cols } = config;
    const { x, y } = coordinate;

    return x >= 0 && x < cols && y >= 0 && y < rows;
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
    const { config } = this.levelData!.level;
    return /*html*/ `<div id="${this.id}" ${inlineStyles({ width: `${config.size * config.cols}px`, height: `${config.size * config.rows}px` })} class="${CLASS_NAMES.GRID}"></div>`;
  }

  /**
   * Renderizar los elementos dentro de la grilla, dependiendo del nivel..
   * @returns
   */
  children(): Component[] {
    if (!this.levelData) return [];

    const tiles = this.levelData.level.tiles.map((v) => new Tile(v));
    const bricks = this.levelData.level.bricks.map((v) => new Brick(v));
    const boxes = this.levelData.level.boxes.map((v) => new Box(v));
    const rainbows = this.levelData.level.rainbows.map((v) => new Rainbow(v));
    const uniconrs = this.levelData.level.uniconrs.map((v) => new Unicorn(v));

    this.unicorns = this.createGameObjects(this.levelData.unicorns, uniconrs);
    this.boxes = this.createGameObjects(this.levelData.boxes, boxes);

    this.rainbows = Object.fromEntries(
      Object.entries(this.levelData.rainbows).map(([key, id]) => [
        key,
        {
          id,
          isVisible: true,
          obj: rainbows.find((rainbow) => rainbow.id === id)!,
        },
      ]),
    ) as IRainbowGame;

    // console.log("UNICORNS: ", this.unicorns);
    // console.log("BOXES: ", this.boxes);
    // console.log("RAINBOWS: ", this.rainbows);

    // this.unicors =

    return [...tiles, ...boxes, ...rainbows, ...uniconrs, ...bricks];
  }

  createGameObjects<T extends { id: string }>(
    data: Record<string, [number, number, ...number[]]>,
    objects: T[],
  ): Record<string, { position: ICoordinate; isVisible: boolean; obj: T }> {
    return Object.fromEntries(
      Object.entries(data).map(([key, [x, y]]) => [
        key,
        {
          position: { x, y },
          isVisible: true,
          obj: objects.find((obj) => obj.id === key)!,
        },
      ]),
    );
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
