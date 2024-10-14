export const FPS = 1000 / 24;

export const CELL_WIDTH = 30;
export const CELL_HEIGHT = 30;

export const CELLS_X = Math.floor(window.innerWidth / CELL_WIDTH);
export const CELLS_Y = Math.floor(window.innerHeight / CELL_HEIGHT);

export const FLAG_SIZES_X = 20;
export const FLAG_SIZES_Y = 20;

export enum DIFFICULTY {
  EASY = 10, MEDIUM = 15, HARD = 20, Impossible = 25
};

export const MINES_NUMBER = Math.floor(CELLS_X * CELLS_Y / 100 * DIFFICULTY.MEDIUM);

export const NUMBER_FONT = "24px serif";
export const NUMBER_X_OFFSET = 8;
export const NUMBER_Y_OFFSET = 22;

export const BACKGROUND_COLOR = "grey";

export const COLOR_NUMBERS = [
  "green",
  "yellow",
  "red",
  "blue",
  "orange",
  "purple",
  "aqua",
  "pink",
];
