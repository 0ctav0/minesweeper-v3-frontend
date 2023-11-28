import { CELLS_COUNTS_X, CELLS_COUNTS_Y, MINES_NUMBER } from "./constants";
import { random } from "./helpers";

type GameState = "IN_PROGRESS" | "PAUSE" | "FAILURE" | "WIN";
type Event = { type: "PLAY_DEATH" | "WIN"; payload?: any };

export class Cell {
  mined: boolean;
  flagged = false;
  opened = false;
  nearbyMines = 0;

  constructor(mine: boolean) {
    this.mined = mine;
  }
}

/**
 * Contains all game's data and logic related to game mechanics
 */
export class GameModel {
  state: GameState = "IN_PROGRESS";
  eventQueue: Event[] = [];
  private cells: Record<string, Cell> = {};

  constructor() {
    for (let x = 0; x < CELLS_COUNTS_X; x++) {
      for (let y = 0; y < CELLS_COUNTS_Y; y++) {
        this.setCell(x, y, new Cell(false));
      }
    }
    this.generateMines();
  }

  private generateMines() {
    for (let i = 0; i < MINES_NUMBER; i++) {
      const x = random(0, CELLS_COUNTS_X);
      const y = random(0, CELLS_COUNTS_Y);
      const cell = this.getCell(x, y);
      if (cell && cell.mined) {
        i--;
      } else {
        this.setCell(x, y, new Cell(true));
      }
    }
  }

  getCell(x: number, y: number) {
    return this.cells[String(x) + "," + String(y)];
  }

  setCell(x: number, y: number, cell: Cell) {
    this.cells[String(x) + "," + String(y)] = cell;
  }

  openAt(x: number, y: number) {
    const cell = this.getCell(x, y);
    if (this.state !== "IN_PROGRESS" || cell.opened) return;
    if (!cell.flagged) {
      cell.opened = true;
      if (cell.mined) {
        this.state = "FAILURE";
        this.eventQueue.push({ type: "PLAY_DEATH" });
      } else {
        this.exploreMap(x, y);
        if (this.isWin()) {
          this.state = "WIN";
          this.eventQueue.push({ type: "WIN" });
        }
      }
    }
  }

  private isWin() {
    let opened = 0;
    for (let x = 0; x < CELLS_COUNTS_X; x++) {
      for (let y = 0; y < CELLS_COUNTS_Y; y++) {
        const cell = this.getCell(x, y);
        if (cell.opened) opened++;
      }
    }
    return CELLS_COUNTS_X * CELLS_COUNTS_Y - opened === MINES_NUMBER;
  }

  getFlagsNumber() {
    let flags = 0;
    for (let x = 0; x < CELLS_COUNTS_X; x++) {
      for (let y = 0; y < CELLS_COUNTS_Y; y++) {
        const cell = this.getCell(x, y);
        if (cell.flagged) flags++;
      }
    }
    return flags;
  }

  private exploreMap(startX: number, startY: number) {
    const startingCell = this.getCell(startX, startY);
    const mines = this.getNearbyMines(startX, startY);
    startingCell.opened = true;
    if (mines) {
      startingCell.nearbyMines = mines;
      return;
    }
    for (
      let x = Math.max(0, startX - 1);
      x <= Math.min(startX + 1, CELLS_COUNTS_X - 1);
      x++
    ) {
      for (
        let y = Math.max(0, startY - 1);
        y <= Math.min(startY + 1, CELLS_COUNTS_Y - 1);
        y++
      ) {
        const cell = this.getCell(x, y);
        if (cell.opened) continue; // do not check already opened cell
        this.exploreMap(x, y);
      }
    }
  }

  private getNearbyMines(startX: number, startY: number) {
    let nearbyMines = 0;
    for (
      let x = Math.max(0, startX - 1);
      x <= Math.min(startX + 1, CELLS_COUNTS_X - 1);
      x++
    ) {
      for (
        let y = Math.max(0, startY - 1);
        y <= Math.min(startY + 1, CELLS_COUNTS_Y - 1);
        y++
      ) {
        const cell = this.getCell(x, y);
        if (cell.mined) nearbyMines++;
      }
    }
    return nearbyMines;
  }

  flagAt(x: number, y: number) {
    if (this.state !== "IN_PROGRESS") return;
    const cell = this.getCell(x, y);
    cell.flagged = !cell.flagged;
  }
}