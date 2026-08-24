type TClassItem = string | [boolean, string];

export const classNames = (...list: TClassItem[]) =>
  list
    .filter((item) => (Array.isArray(item) ? item[0] : Boolean(item)))
    .map((item) => (Array.isArray(item) ? item[1] : item))
    .join(" ")
    .trim();
