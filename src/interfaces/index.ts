import { ETypeBox, ETypeUnicorn } from "../utils/constants";

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
