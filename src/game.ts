import { CELLS_COUNTS, MINES_NUMBER } from "./constants";
import { random } from "./helpers";

type GameState = "IN_PROGRESS" | "PAUSE" | "FAILURE" | "WIN";
type Event = { type: "PLAY_DEATH"; payload?: any };

export class Cell {
  mined: boolean;
  flagged = false;
  opened = false;
  nearbyMines = 0;
  __dirty = false; // for internal use; used in explore map's algorithm; not used in game logic

  constructor(mine: boolean) {
    this.mined = mine;
  }
}

export class Game {
  state: GameState = "IN_PROGRESS";
  eventQueue: Event[] = [];
  private cells: Record<string, Cell> = {};

  constructor() {
    for (let x = 0; x < CELLS_COUNTS[0]; x++) {
      for (let y = 0; y < CELLS_COUNTS[1]; y++) {
        this.setCell(x, y, new Cell(false));
      }
    }
    this.generateMines();
  }

  private generateMines() {
    for (let i = 0; i < MINES_NUMBER; i++) {
      const x = random(0, CELLS_COUNTS[0]);
      const y = random(0, CELLS_COUNTS[1]);
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
        this.__cleanCells();
      }
    }
  }

  private exploreMap(startX: number, startY: number) {
    const startingCell = this.getCell(startX, startY);
    startingCell.__dirty = true;
    const mines = this.getNearbyMines(startX, startY);
    console.debug(
      "start",
      startX,
      startY,
      mines ? `mines: ${mines}` : "no mines"
    );
    startingCell.opened = true;
    if (mines) {
      startingCell.nearbyMines = mines;
      return;
    }
    for (
      let x = Math.max(0, startX - 1);
      x <= Math.min(startX + 1, CELLS_COUNTS[0] - 1);
      x++
    ) {
      for (
        let y = Math.max(0, startY - 1);
        y <= Math.min(startY + 1, CELLS_COUNTS[1] - 1);
        y++
      ) {
        const cell = this.getCell(x, y);
        if ((x === startX && y === startY) || cell.opened || cell.__dirty)
          continue; // do not check already opened/checked cell
        console.debug("iter", x, y);
        this.exploreMap(x, y);
      }
    }
  }

  private getNearbyMines(startX: number, startY: number) {
    let nearbyMines = 0;
    for (
      let x = Math.max(0, startX - 1);
      x <= Math.min(startX + 1, CELLS_COUNTS[0] - 1);
      x++
    ) {
      for (
        let y = Math.max(0, startY - 1);
        y <= Math.min(startY + 1, CELLS_COUNTS[1] - 1);
        y++
      ) {
        const cell = this.getCell(x, y);
        if (x === startX && y === startY) continue; // do not check itself opened cell
        if (cell.mined) nearbyMines++;
      }
    }
    return nearbyMines;
  }

  private __cleanCells() {
    for (let x = 0; x < CELLS_COUNTS[0]; x++) {
      for (let y = 0; y < CELLS_COUNTS[1]; y++) {
        this.getCell(x, y).__dirty = false;
      }
    }
  }

  flagAt(x: number, y: number) {
    if (this.state !== "IN_PROGRESS") return;
    const cell = this.getCell(x, y);
    cell.flagged = !cell.flagged;
  }
}
