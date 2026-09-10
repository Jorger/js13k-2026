import "./styles.css";
import { Box, Brick, Rainbow, Tile, Unicorn } from "../index";
import { cloneDeep, inlineStyles, setHtml } from "../../../../utils/helpers";
import { getElement } from "../../../../utils/getElement";
import { guid } from "../../../../utils/guid";
import { PlaySound } from "../../../../utils/sounds";
import {
  EDirections,
  ESounds,
  ETypeBox,
  INPUT_DIRECTION,
  OPOSITE_DIRECTION,
  SPEED_MOVEMENT,
} from "../../../../utils/constants";
import Component from "../component";
import InputManager from "../../../../utils/inputManager";
import type {
  Direction,
  IBoxGame,
  ICoordinate,
  IElementsMove,
  IlevelData,
  IRainbowGame,
  IUnicornGame,
  TGameOver,
  TKey,
} from "../../../../interfaces";

const BASE_NAME_ID = "g";

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
   * Para el intervalo el game over...
   */
  timeoutGameOver: ReturnType<typeof setTimeout> | null = null;

  /**
   * Para saber si el juego ha acabado...
   */
  isGameOver = false;

  /**
   * La totalidad de arcoris que se han recogido...
   */
  collectedRainbows = 0;

  /**
   * Total de arcoiris que hay en el escenario...
   */
  totalRainbows = 0;

  /**
   * Las cajas solidad que se moverán adicionalmente...
   */
  solidBoxToMove: { key: string; newPosition: ICoordinate }[] = [];

  /**
   * Para indicar que pase al siguiente nivel..
   */
  handleNextLevel: TGameOver;

  constructor(levelData: IlevelData, handleNextLevel: TGameOver) {
    super();

    this.levelData = levelData;
    this.id = `${BASE_NAME_ID}-${guid()}`;
    this.handleNextLevel = handleNextLevel;

    this.inputManager = new InputManager(this.handleMoveElement.bind(this));
  }

  /**
   * Para manejar el movimiento de los elementos del juego,
   * dependiendo de la dirección que se reciba...
   * @param direction
   * @returns
   */
  handleMoveElement(direction: Direction | null) {
    if (this.isGameOver || !direction || this.elementsMove.length !== 0) {
      return;
    }

    this.validateMovement(direction);
  }

  /**
   * Valida el movimiento de los unicorios y demás elementos...
   * @param direction
   */
  validateMovement(direction: Direction) {
    if (this.isGameOver) {
      return;
    }

    /**
     * Se obtiene el orden de evaluaciónd de los unicornios,
     * y se itera si se pueden o no mover...
     */
    this.getOrderEvaluationUnicorns(direction).forEach((key) =>
      this.unicornCanMove(key, direction),
    );

    this.moveElements(direction);
  }

  moveElements(direction: Direction) {
    if (!this.elementsMove.length) return;

    const { size } = this.levelData!.level.config;
    let moveBox = false;

    this.elementsMove.forEach(({ id, type, coordinate }) => {
      const element = type === 1 ? this.unicorns![id] : this.boxes![id];

      if (!moveBox && type === 2) {
        moveBox = true;
      }

      if (
        type === 1 &&
        (direction === EDirections.left || direction === EDirections.right)
      ) {
        this.unicorns![id].obj.direction = direction;
      }

      element.obj.move({
        x: coordinate.x * size,
        y: coordinate.y * size,
      });

      element.position = coordinate;
    });

    this.timeoutId = setTimeout(
      this.validateEndMovement.bind(this),
      SPEED_MOVEMENT,
    );

    // Sonido por defecto para el movimiento dle unicornio(s)...
    PlaySound(ESounds.MOVE);

    if (moveBox) {
      PlaySound(ESounds.MOVE_BOX);
    }
  }

  validateEndMovement() {
    this.elementsMove
      .filter(({ type }) => type === 1)
      .forEach(({ id }) => this.unicorns![id].obj.idle());

    if (!this.elementIsOnFloor()) {
      return;
    }

    this.elementsMove = [];

    if (this.inputManager.currentDirection) {
      this.validateMovement(this.inputManager.currentDirection);
    }
  }

  elementIsOnFloor() {
    const { floor } = this.levelData!;
    let isOnFloor = true;
    let typePickRainbow = 0;

    this.elementsMove.forEach(({ id, coordinate, type }) => {
      const key = this.getKey(coordinate);
      const element = type === 1 ? this.unicorns![id] : this.boxes![id];

      if (!floor[key]) {
        element.obj.sink();
        element.isVisible = false;

        if (type === 1) {
          isOnFloor = false;
        }
      }

      const rainbow = this.rainbows![key];

      if (rainbow?.isVisible) {
        rainbow.isVisible = false;
        rainbow.obj.pickUp();
        this.collectedRainbows++;

        typePickRainbow = type;

        // Sonido que indica que tomo el arcoiris...
        PlaySound(ESounds.COIN);
      }
    });

    if (!isOnFloor) {
      this.validateGameOver();
    } else if (this.collectedRainbows >= this.totalRainbows) {
      this.validateGameOver(typePickRainbow === 1);
    }

    return isOnFloor;
  }

  /**
   * Para determinar el orden de evaluación que se hace de los unicorns,
   * este orden ayuda a que si hay un unicornio adelante de otro, ese ya se debió
   * haber evaluado...
   * @param direction
   * @returns
   */
  getOrderEvaluationUnicorns(direction: Direction) {
    const coordinate =
      direction === EDirections.left || direction === EDirections.right
        ? "x"
        : "y";

    const isAscending =
      direction === EDirections.left || direction === EDirections.up;

    return this.getListUnicorns()
      .map((id) => ({
        id,
        value: this.unicorns![id].position[coordinate] ?? 0,
      }))
      .sort((a, b) => (isAscending ? a.value - b.value : b.value - a.value))
      .map(({ id }) => id);
  }

  /**
   * Se valida si el unicornio de puede o no mover...
   * @param unicornKey
   * @param direction
   * @returns
   */
  unicornCanMove(unicornKey: string, direction: Direction) {
    /**
     * Se obtiene la información de los muros (bricks)...
     */
    const { walls } = this.levelData!;

    /**
     * Se obtiene la dirección de las coordenadas que se van a incrementar/decementar
     * dependiendo de la dirección...
     */
    const nextCoordinate = INPUT_DIRECTION[direction];

    /**
     * Se obtiene la dirección del unicornio que se está evaluando...
     */
    const position = this.unicorns![unicornKey].position;

    /**
     * Se calcula la posición a donde llegaría el unicornio...
     */
    const newPosition: ICoordinate = {
      x: position.x + nextCoordinate.x,
      y: position.y + nextCoordinate.y,
    };

    /**
     * Hay un muro, por lo tanto no se puede mover...
     */
    if (walls[this.getKey(newPosition)]) return;

    let canMove = true;

    const isBox = this.getBoxPosition(newPosition);

    /**
     * Si hay una caja, así que se debe hacer las validaciones de las cajas...
     */
    if (isBox) {
      /**
       * Se obtiene la caja...
       */
      const box = this.boxes![isBox];

      /**
       * Se obtiene el game object relacioando a la caja...
       */
      const { obj } = box;

      /**
       * EL label es el número de unicorns que se necesitan para accionar la caja...
       */
      const { label, type } = obj;

      /**
       * Se obtiene el número de unicornios que están moviendo la caja...
       */
      const totalUnicorns = this.validateNumberUnicorns(isBox, direction);

      canMove = totalUnicorns >= label;

      if (canMove) {
        /**
         * Es una caja normal, por tanto se destruye y el espacio queda dismponble...
         */
        if (type === ETypeBox.NORMAL) {
          /**
           * Para que haga la acciónd de "destruirse"...
           */
          obj.explode();

          /**
           * Se indica que ya no está visible...
           */
          this.boxes![isBox].isVisible = false;
        } else {
          canMove = this.validateBoxItemsAhead(
            isBox,
            nextCoordinate,
            totalUnicorns,
          );

          if (canMove) {
            const newPositionBox: ICoordinate = {
              x: box.position.x + nextCoordinate.x,
              y: box.position.y + nextCoordinate.y,
            };

            this.elementsMove.push({
              id: isBox,
              type: 2,
              coordinate: newPositionBox,
            });
          }
        }
      }
    }

    if (!canMove) return;

    /**
     * Ahora saber si hay otro unicornio y si es así saber si ya está dentro de los elementos que
     * se van a mover, por lo que se interpreta qeu la posición estará dosponible...
     */
    const isUnicorn = this.getUnicornPosition(newPosition);

    /**
     * Si hay un unicornio, se valida si el unicornio ya estaba en el array de elementos a mover...
     */
    if (isUnicorn) {
      canMove = !!this.elementsMove.find((v) => v.id === isUnicorn);
    }

    if (canMove) {
      this.elementsMove.push({
        id: unicornKey,
        type: 1,
        coordinate: newPosition,
      });
    }
  }

  /**
   * Valida los elementos que tenga adelante la caja...
   * @param position
   * @param totalUnicornsBack
   */
  validateBoxItemsAhead(
    boxKey: string,
    nextCoordinate: ICoordinate,
    totalUnicornsBack: number,
  ) {
    /**
     * Se deja vacia la información...
     */
    this.solidBoxToMove = [];

    /**
     * Se obtiene la caja...
     */
    const box = this.boxes![boxKey];

    /**
     * El valor base de la caja que se está moviendo...
     */
    let baseLevel = box.obj.label;

    /**
     * Se obtiene la posición en la cual está la caja...
     */
    const position = box.position;

    /**
     * Se evalua la siguiente posición...
     */
    const newPosition: ICoordinate = {
      x: position.x + nextCoordinate.x,
      y: position.y + nextCoordinate.y,
    };

    /**
     * Para saber si la cjaja se puede mover...
     */
    let canMove = true;

    while (this.isCoordinateInRange(newPosition)) {
      const validation = this.isBoxBlocked(
        newPosition,
        baseLevel,
        totalUnicornsBack,
        nextCoordinate,
      );

      if (!validation.isBlock) {
        canMove = true;
        break;
      }

      if (validation.isBlock && !validation.isBoxMove) {
        canMove = false;
        break;
      }

      baseLevel = validation.newBaseLevel;

      /**
       * Se incrementa la nueva posición a validar...
       */
      newPosition.x = newPosition.x + nextCoordinate.x;
      newPosition.y = newPosition.y + nextCoordinate.y;
    }

    if (canMove && this.solidBoxToMove.length !== 0) {
      this.solidBoxToMove.forEach(({ key, newPosition }) => {
        this.elementsMove.push({
          id: key,
          type: 2,
          coordinate: newPosition,
        });
      });
    }

    return canMove;
  }

  isBoxBlocked(
    newPosition: ICoordinate,
    baseLevel: number,
    totalUnicornsBack: number,
    nextCoordinate: ICoordinate,
  ) {
    const { walls } = this.levelData!;

    const isAWall = walls[this.getKey(newPosition)];

    let newBaseLevel = baseLevel;

    /**
     * Es un muro, no se puede mover...
     */
    if (isAWall) {
      return { newBaseLevel, isBlock: true, isBoxMove: false };
    }

    /**
     * Validar si es un unicornio...
     */
    const isUnicorn = this.getUnicornPosition(newPosition);

    if (isUnicorn) {
      /**
       * Saber si el unicornio está en el listado de elementos a mover,
       * si no es así no se puede mover...
       */
      if (!!this.elementsMove.find((v) => v.id === isUnicorn)) {
        return { newBaseLevel, isBlock: true, isBoxMove: false };
      }
    }

    /**
     * Validar si es una caja...
     */
    const isABox = this.getBoxPosition(newPosition);

    if (isABox) {
      const boxInPosition = this.boxes![isABox];
      const objBoxInPosition = boxInPosition.obj;
      const levelBoxInPosition = objBoxInPosition.label;
      newBaseLevel += levelBoxInPosition;

      if (newBaseLevel > totalUnicornsBack) {
        return { newBaseLevel, isBlock: true, isBoxMove: false };
      } else {
        if (boxInPosition.obj.type === ETypeBox.NORMAL) {
          boxInPosition.isVisible = false;
          objBoxInPosition.explode();
        } else {
          // Saber si este se puede mover...
          const newPositionBox: ICoordinate = {
            x: newPosition.x + nextCoordinate.x,
            y: newPosition.y + nextCoordinate.y,
          };

          this.solidBoxToMove.push({
            key: isABox,
            newPosition: newPositionBox,
          });

          return { newBaseLevel, isBlock: true, isBoxMove: true };
        }
      }
    }

    return { newBaseLevel, isBlock: false, isBoxMove: false };
  }

  getBoxPosition(position: ICoordinate) {
    return this.getObjectPosition(position, this.boxes!);
  }

  getUnicornPosition(position: ICoordinate) {
    return this.getObjectPosition(position, this.unicorns!);
  }

  getObjectPosition(
    position: ICoordinate,
    objects: Record<string, { isVisible: boolean; position: ICoordinate }>,
  ) {
    return Object.keys(objects).find(
      (id) =>
        objects[id].isVisible &&
        objects[id].position.x === position.x &&
        objects[id].position.y === position.y,
    );
  }

  /**
   * Se valida la cantidad de unicornios que está haciendo el movimiento de la caja,
   * en este caso se evalua el valor de atrás, por ejemplo si se está moviendo a la
   * derecha se buscan los unicornios que estén a la izquierda de la posición de la
   * caja...
   * @param boxKey
   * @param direction
   * @returns
   */
  validateNumberUnicorns(boxKey: string, direction: Direction) {
    /**
     * Se obtiene la caja...
     */
    const box = this.boxes![boxKey];
    /**
     * Se toma la posición de la caja (se clona para no modificar el valor actual)...
     */
    const newPosition = cloneDeep(box.position);

    /**
     * Se calcula la posición opuesta a donde está la dirección...
     */
    const directionEvaluate = OPOSITE_DIRECTION[direction];

    /**
     * Se obtiene el valor de incremenento de la posición a evaluar...
     */
    const increaseDirection = INPUT_DIRECTION[directionEvaluate];

    /**
     * Mantiene el total de unicornios...
     */
    let totalUniconrs = 0;

    /**
     * Se itera hasta que la posición haya quedado por fuera de rango...
     */
    while (this.isCoordinateInRange(newPosition)) {
      // Validar si en la nueva posición a un unicornio...
      newPosition.x = newPosition.x + increaseDirection.x;
      newPosition.y = newPosition.y + increaseDirection.y;

      /**
       * Para saber si dada la posición hay un unicornio
       */
      const isUnicorn = this.getUnicornPosition(newPosition);

      /**
       * Se incrementa la cantidad de unicornios...
       */
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

  getListUnicorns() {
    return Object.keys(this.unicorns!);
  }

  validateGameOver(completeRainbows = false) {
    if (this.isGameOver) return;

    this.isGameOver = true;

    const unicorns = this.getListUnicorns();
    const allUnicornsOnFloor = unicorns.every(
      (id) => this.unicorns![id].isVisible,
    );

    this.timeoutGameOver = setTimeout(() => {
      const isNextLevel = completeRainbows && allUnicornsOnFloor;
      // if (!isNextLevel) {
      //   PlaySound(ESounds.GAME_OVER);
      // }
      this.handleNextLevel(isNextLevel);
    }, SPEED_MOVEMENT);
  }

  get el(): HTMLElement | null {
    if (this.element) {
      return this.element;
    }

    this.element = getElement(this.id, this.element);

    return this.element;
  }

  render() {
    const { size, rows, cols } = this.levelData!.level.config;
    return /*html*/ `<div class="grid" id="${this.id}" ${inlineStyles({ width: `${size * cols}px`, height: `${size * rows}px` })}></div>`;
  }

  /**
   * Renderizar los elementos dentro de la grilla, dependiendo del nivel..
   * @returns
   */
  children(): Component[] {
    if (!this.levelData) return [];

    const {
      level,
      unicorns: unicornData,
      boxes: boxData,
      rainbows: rainbowData,
    } = this.levelData;

    const tiles = level.tiles.map((v) => new Tile(v));
    const bricks = level.bricks.map((v) => new Brick(v));
    const boxes = level.boxes.map((v) => new Box(v));
    const rainbows = level.rainbows.map((v) => new Rainbow(v));
    const unicorns = level.uniconrs.map((v) => new Unicorn(v));

    this.unicorns = this.createGameObjects(unicornData, unicorns);
    this.boxes = this.createGameObjects(boxData, boxes);
    this.totalRainbows = rainbows.length;

    this.rainbows = Object.fromEntries(
      Object.entries(rainbowData).map(([key, id]) => [
        key,
        {
          id,
          isVisible: true,
          obj: rainbows.find((rainbow) => rainbow.id === id)!,
        },
      ]),
    ) as IRainbowGame;

    return [...tiles, ...rainbows, ...boxes, ...unicorns, ...bricks];
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
  }

  unmount() {
    this.inputManager.unmount();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (this.timeoutGameOver) {
      clearTimeout(this.timeoutGameOver);
    }
  }
}

export default Grid;
