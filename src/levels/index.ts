import { LOCAL_STORAGE_KEY } from "../utils/constants";
import { isValidNumber } from "../utils/helpers";
import { getValueFromCache, savePropierties } from "../utils/storage";
import LEVELS from "./LEVELS";

export const getTotalLevels = () => LEVELS.length;

// export const getLevel = (level = 0) => convertLevel(LEVELS[level]);

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
