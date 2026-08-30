import { Direction, TInputDirection } from "../interfaces";

export const BASE_WIDTH = 412;
export const BASE_HEIGHT = 732;
export const GAME_LABEL_ATTRIBUTE = "level";
export const CUSTOM_ROUTER_EVENT_NAME = "navigate";
export const SPEED_MOVEMENT = 400;

export const GAME_OBJECT_CLASS = "game-object";

// export const BASE_NAME_ID = {
//   BOX: "box",
//   BRICK: "brick",
//   RAINBOW: "rainbow",
//   TILE: "tile",
//   UNICORN: "unicorn",
// };

export const SHORT_CLASS_NAMES: Record<string, string> = {
  DF: "df",
  JC: "jc",
  AI: "ai",
  WI: "wi",
  HE: "he",
};

export const BASE_PAGE_CLASS = Object.keys(SHORT_CLASS_NAMES)
  .map((v) => SHORT_CLASS_NAMES[v])
  .join(" ");

export const LOCAL_STORAGE_KEY = {
  LEVEL: "level",
  SOUNDS: "sounds",
  SELECTED: "selected",
};

export const ROUTER_PAGE = {
  LOBBY: "lobby",
  LEVEL_SELECT: "level-select",
  GAME: "game",
};

export const ROUTER_COMPONENT = {
  ROUTER: "app-router",
  GAME: "app-game",
  GRID: "grid-game",
  LEVEL_SELECT: "app-level-select",
  LOBBY: "app-lobby",
};

export const EVENT_TYPE = {
  CLICK: "click",
  MOUSE_DOWN: "mousedown",
  MOUSE_MOVE: "mousemove",
  MOUSE_UP: "mouseup",
  TOUCH_START: "touchstart",
  TOUCH_MOVE: "touchmove",
  TOUCH_END: "touchend",
  KEY_DOWN: "keydown",
  KEY_UP: "keyup",
  RESIZE: "resize",
  CONTEXT_MENU: "contextmenu",
};

export enum ETypeUnicorn {
  NORMAL = "NORMAL",
  INVERT = "INVERT",
}

export enum ETypeBox {
  NORMAL = "NORMAL",
  SOLID = "SOLID",
}

// export enum ETiles {
//   BRICK,
//   COIN,
//   SPIKE,
//   KEYS,
//   GATES,
//   BOXES,
// }

export enum EDirections {
  up = "up",
  down = "down",
  left = "left",
  right = "right",
}

export const OPOSITE_DIRECTION: Record<EDirections, EDirections> = {
  [EDirections.up]: EDirections.down,
  [EDirections.down]: EDirections.up,
  [EDirections.left]: EDirections.right,
  [EDirections.right]: EDirections.left,
};

export const KEY_DIRECTION: Record<string, Direction> = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
  KeyA: "left",
  KeyW: "up",
  KeyD: "right",
  KeyS: "down",
};

// export enum ESounds {
//   CLICK,
//   SWIPE,
//   COIN,
//   EXPLODE,
//   KEY,
//   OPEN,
//   DESTROY,
//   SUCESS,
//   GAME_OVER,
// }

export const INPUT_DIRECTION: TInputDirection = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
