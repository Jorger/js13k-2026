import { ETypeBox, ETypeUnicorn, LOCAL_STORAGE_KEY } from "../utils/constants";
import { getValueFromCache, savePropierties } from "../utils/storage";
import { isValidNumber, numberStringToNumber } from "../utils/helpers";
import LEVELS from "./LEVELS";
import type {
  IBox,
  IGameObject,
  IlevelData,
  ILevelMatrix,
} from "../interfaces";
import { guid } from "../utils/guid";

const getGameObjectByType = (data: number[][], type = 0) =>
  data.filter((v) => v[0] === type);

const dataGameObject = (
  data: (string | number)[][],
  size: number,
): IGameObject[] =>
  data.map((v) => ({
    id: String(v[0]),
    position: { x: +v[3] * size, y: +v[2] * size },
    size,
  }));

const dataBox = (data: (string | number)[][], size: number): IBox[] =>
  data.map((v) => ({
    id: String(v[0]),
    position: { x: +v[3] * size, y: +v[2] * size },
    size,
    label: +v[3],
    type: +v[4] === 1 ? ETypeBox.NORMAL : ETypeBox.SOLID,
  }));

const getMatrix = (data: (string | number)[][]): ILevelMatrix[] => {
  return data.map(([id, type, col, row, ...rest]) => [
    String(id),
    +type,
    +row,
    +col,
    rest.join(","),
  ]);
};

/**
 * Dado el nivel se convierte a un objecto para ser renderizado en el cliente...
 */
const convertLevel = (level = ""): IlevelData => {
  /**
   * Tiles: row,col|row,col (0) sólo decir cuando no hay tile
   * Bricks: row,col|row,col (1)
   * Boxes: row,col,label*,type*|row,col,label*,type* (2)
   * rainbows: row,col|row,col (3)
   * uniconrs: row,col|row,col (4)
   */
  // "4,4,70;0,0,2|0,1,2|0,1,3|0,2,1|0,2,2|0,2,3|0,3,0|0,3,1|0,3,2|1,3,0|2,1,2,2,1|3,0,2|4,3,1|4,3,2"
  const [config, data] = level.split(";");
  const [rows, cols, size] = numberStringToNumber(config.split(","));
  const dataLevel = data.split("|").map((v) => v.split(",").map(Number));

  // Para obtener los Tiles.
  const [baseTile, baseBrick, baseBox, baseRainbow, baseUnicorn] = Array.from(
    { length: 5 },
    (_, key) => getGameObjectByType(dataLevel, key).map((v) => [guid(), ...v]),
  );

  // console.log({ baseTile, baseBrick, baseBox, baseRainbow, baseUnicorn });

  // const [brick, box, rainbow, unicorn] = Array.from({ length: 5 }, (_, key) =>
  //   getGameObjectByType(dataLevel, key + 1),
  // ).map(v => [guid(), ...v]);

  // Array.from({ length: 4 }, (_, key) => key + 1)

  // const tiles = dataGameObject(baseTile, size);
  // const bricks = dataGameObject(baseBrick, size);
  // const boxes = dataBox(baseBox, size);
  // const rainbows = dataGameObject(baseRainbow, size);

  // const uniconrs: IUnicorn[] = dataGameObject(baseUnicorn, size).map(
  //   (v, i) => ({
  //     ...v,
  //     type: i % 2 === 0 ? ETypeUnicorn.NORMAL : ETypeUnicorn.INVERT,
  //   }),
  // );

  // console.log("dataLevel: ", dataLevel);
  // const tets = [...brick, ...box, ...rainbow, ...unicorn];
  // console.log(getMatrix([...brick, ...box, ...rainbow, ...unicorn]));

  return {
    level: {
      config: {
        rows,
        cols,
        size,
      },
      tiles: dataGameObject(baseTile, size),
      bricks: dataGameObject(baseBrick, size),
      boxes: dataBox(baseBox, size),
      rainbows: dataGameObject(baseRainbow, size),
      uniconrs: dataGameObject(baseUnicorn, size).map((v, i) => ({
        ...v,
        type: i % 2 === 0 ? ETypeUnicorn.NORMAL : ETypeUnicorn.INVERT,
      })),
    },
    matrix: getMatrix([
      ...baseBrick,
      ...baseBox,
      ...baseRainbow,
      ...baseUnicorn,
    ]),
  };
};

export const getTotalLevels = () => LEVELS.length;

export const getLevel = (level = 0) => convertLevel(LEVELS[level]);

export const isValidLevelFromCache = (level: string) => {
  // Valida si el valor en caché es un número válido, de lo contrario usa "0"
  const completedLevel = +(isValidNumber(level) ? level : "0");

  return completedLevel >= 0 && completedLevel <= getTotalLevels()
    ? completedLevel
    : 0;
};

// Obtiene el nivel completado almacenado en caché (LocalStorage)
export const getCurrentLevelFromCache = () =>
  isValidLevelFromCache(getValueFromCache(LOCAL_STORAGE_KEY.LEVEL, "0"));

/**
 * Devuelve el nivel que se ha seleccionado
 * @returns
 */
export const getSelectedLevel = () =>
  isValidLevelFromCache(getValueFromCache(LOCAL_STORAGE_KEY.SELECTED, "0"));

export const saveLevelCache = (currentLevel = 0) => {
  const nextLevel = currentLevel + 1;
  const completedLevel = getCurrentLevelFromCache();

  if (
    nextLevel >= 0 &&
    nextLevel <= getTotalLevels() &&
    nextLevel > completedLevel
  ) {
    savePropierties(LOCAL_STORAGE_KEY.LEVEL, nextLevel);
  }
};
