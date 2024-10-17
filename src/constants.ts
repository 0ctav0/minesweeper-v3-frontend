export const FPS = 1000 / 24;

export const CELL_WIDTH = 30;
export const CELL_HEIGHT = 30;

export const ID = {
  status: "status",
  soundBtn: "sound-btn",
  optionsBtn: "options-btn",
  playBtn: "play-btn",
  menuPopup: "menu-popup",
  easyVal: "easy-val",
  mediumVal: "medium-val",
  hardVal: "hard-val",
  impossibleVal: "impossible-val",
}

export const CLASS = {
  disabled: "disabled",
}

export const StatusText = {
  defeat: "Defeat",
  win: "Win"
}

const TOP_PANEL_HEIGHT = 40;

const CELLS_X_MAX = 20;
const CELLS_Y_MAX = 24;

export const CELLS_X = Math.min(Math.floor(window.innerWidth / CELL_WIDTH), CELLS_X_MAX);
export const CELLS_Y = Math.min(Math.floor((window.innerHeight - TOP_PANEL_HEIGHT) / CELL_HEIGHT), CELLS_Y_MAX);

export const FLAG_SIZES_X = 20;
export const FLAG_SIZES_Y = 20;

export type Difficulty = "easy" | "medium" | "hard" | "impossible";
export const DifficultyMines: Record<Difficulty, number> = {
  easy: 10,
  medium: 15,
  hard: 20,
  impossible: 25,
}

export enum DIFFICULTY {
  EASY = 10, MEDIUM = 15, HARD = 20, Impossible = 25
};

export const getMinesNumber = (difficulty: Difficulty) => Math.floor(CELLS_X * CELLS_Y / 100 * DifficultyMines[difficulty]);

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
