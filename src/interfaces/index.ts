export interface coordinate {
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
