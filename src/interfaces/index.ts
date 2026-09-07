import { Box, Rainbow, Unicorn } from "../pages/Game/components";
import { ETypeBox, ETypeUnicorn, EDirections } from "../utils/constants";

export type Direction = keyof typeof EDirections;
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
  direction?: Direction;
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

export interface ILevel {
  label: number;
  config: ILevelConfig;
  tiles: IGameObject[];
  bricks: IGameObject[];
  boxes: IBox[];
  rainbows: IGameObject[];
  uniconrs: IUnicorn[];
}

export type TKey = `${number}-${number}`;

export type IElementPosition = Record<TKey, string>;
export type ILevelUnicorns = Record<string, [number, number]>;
export type ILevelBoxes = Record<string, [number, number, number, number]>;

export interface IlevelData {
  level: ILevel;
  floor: IElementPosition;
  walls: IElementPosition;
  rainbows: IElementPosition;
  unicorns: ILevelUnicorns;
  boxes: ILevelBoxes;
}

export type TGameOver = (nextLevel: boolean) => void;

export type DirectionCallback = (direction: Direction | null) => void;
export type TInputDirection = Record<Direction, { x: number; y: number }>;

export type IUnicornGame = Record<
  string,
  { position: ICoordinate; isVisible: boolean; obj: Unicorn }
>;

export type IBoxGame = Record<
  string,
  { position: ICoordinate; isVisible: boolean; obj: Box }
>;

export type IRainbowGame = Record<
  TKey,
  { id: string; isVisible: boolean; obj: Rainbow }
>;

export interface IElementsMove {
  id: string;
  // 1 (unicornio), 2(caja) 3 (arcoiris)
  type: number;
  coordinate: ICoordinate;
}
