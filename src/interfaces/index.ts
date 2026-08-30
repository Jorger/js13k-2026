import { ETypeBox, ETypeUnicorn, EDirections } from "../utils/constants";

export type TTypeUnicorn = keyof typeof ETypeUnicorn;
export type TTypeBox = keyof typeof ETypeBox;

export interface ICoordinate {
  x: number;
  y: number;
}

export interface Level {
  width: number;
  height: number;
}

export type NavigateDetail = {
  page: string;
  params?: Record<string, any>;
};

export interface IGameObject {
  id: string;
  position: ICoordinate;
  size: number;
}

export interface IUnicorn extends IGameObject {
  type?: TTypeUnicorn;
}

export interface IBox extends IGameObject {
  label?: number;
  type?: TTypeBox;
}

export interface ILevelConfig {
  rows: number;
  cols: number;
  size: number;
}

// export interface IGameObjectLevel{
//   data: string;
//   type: number;
//   row: number;
//   col: number;
// }

export interface ILevel {
  label: number;
  config: ILevelConfig;
  tiles: IGameObject[];
  bricks: IGameObject[];
  boxes: IBox[];
  rainbows: IGameObject[];
  uniconrs: IUnicorn[];
}

// row-col
export type TKey = `${number}-${number}`;

// id, type
// export type ILevelMatrix = [string, number];
// type, row, col, extra
// export type ILevelItemMove = [number, number, number, string];

export type IElementPosition = Record<TKey, number>;
// export type ILevelCollider = Record<TKey, ILevelMatrix>;
// export type ILevelGameObjectsMove = Record<string, ILevelItemMove>;
// row, col..
export type ILevelUnicorns = Record<string, [number, number]>;
//row, col, label, type
export type ILevelBoxes = Record<string, [number, number, number, number]>;

export interface IlevelData {
  level: ILevel;
  floor: IElementPosition;
  walls: IElementPosition;
  // objectsMove: ILevelGameObjectsMove;
  rainbows: IElementPosition;
  unicorns: ILevelUnicorns;
  boxes: ILevelBoxes;
}

export type Direction = keyof typeof EDirections;

export type DirectionCallback = (direction: Direction | null) => void;
export type TInputDirection = Record<Direction, { x: number; y: number }>;

export interface IElementGame {
  id: string;
  // 1 (unicornio), 2(caja) 3 (arcoiris)
  type: number;
}

export interface IElementsMove extends IElementGame {
  coordinate: ICoordinate;
}
