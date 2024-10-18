import { CELLS_X, CELLS_Y, getMinesNumber } from "./constants";
import { random } from "./helpers";
import { Event, GameState, Difficulty } from "./types";

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
  state: GameState;
  difficulty: Difficulty;
  eventQueue: Event[] = [];
  mines: number;
  private cells: Record<string, Cell> = {};

  constructor(difficulty: Difficulty) {
    this.mines = getMinesNumber(difficulty);
    this.state = "START";
    this.difficulty = difficulty;
    this.generateField();
  }

  newGame(difficulty: Difficulty) {
    this.mines = getMinesNumber(difficulty);
    this.state = "START";
    this.difficulty = difficulty;
    this.generateField();
  }

  private generateField() {
    for (let x = 0; x < CELLS_X; x++) {
      for (let y = 0; y < CELLS_Y; y++) {
        this.setCell(x, y, new Cell(false));
      }
    }
  }

  private GetBoundIterator(originX: number, originY: number, step: number = 1) {
    const array = [];
    const minX = Math.max(0, originX - step);
    const minY = Math.max(0, originY - step);
    const maxX = Math.min(originX + step, CELLS_X - 1);
    const maxY = Math.min(originY + step, CELLS_Y - 1);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        array.push({ x, y });
      }
    }
    return array;
  }

  private IsInArea(originX: number, checkedX: number, originY: number, checkedY: number): boolean {
    const SAFE_AREA = 1;
    return this.GetBoundIterator(originX, originY, SAFE_AREA)
      .some(({ x, y }) => x == checkedX && y == checkedY
      )
  }

  private GenerateMines(originX: number, originY: number) {
    let i = 0;
    while (i < this.mines) {
      const x = random(0, CELLS_X);
      const y = random(0, CELLS_Y);
      const cell = this.getCell(x, y);
      if (cell.mined || this.IsInArea(originX, x, originY, y)) {
        continue;
      }
      cell.mined = true;
      i++;
    }
  }

  getCell(x: number, y: number) {
    return this.cells[String(x) + "," + String(y)];
  }

  setCell(x: number, y: number, cell: Cell) {
    this.cells[String(x) + "," + String(y)] = cell;
  }

  openAround(startX: number, startY: number) {
    const startingCell = this.getCell(startX, startY);
    if (this.state !== "IN_PROGRESS" || !startingCell.opened) return;
    const nearbyMines = this.getNearbyMines(startX, startY);
    const nearbyFlags = this.getNearbyFlags(startX, startY);
    if (nearbyMines !== nearbyFlags) return;
    this.GetBoundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.getCell(x, y);
      if (cell.opened) return; // do not check already opened cell
      this.openAt(x, y);
    }
    );
  }

  openAt(x: number, y: number) {
    const cell = this.getCell(x, y);
    if (this.state == "START") {
      this.GenerateMines(x, y);
      this.state = "IN_PROGRESS";
    }
    if (this.state !== "IN_PROGRESS" || cell.opened) return;
    if (!cell.flagged) {
      cell.opened = true;
      if (cell.mined) {
        this.state = "DEFEAT";
        this.eventQueue.push({ type: "DEFEAT" });
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
    for (let x = 0; x < CELLS_X; x++) {
      for (let y = 0; y < CELLS_Y; y++) {
        const cell = this.getCell(x, y);
        if (cell.opened) opened++;
      }
    }
    return CELLS_X * CELLS_Y - opened === this.mines;
  }

  getFlagsNumber() {
    let flags = 0;
    for (let x = 0; x < CELLS_X; x++) {
      for (let y = 0; y < CELLS_Y; y++) {
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
    this.GetBoundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.getCell(x, y);
      if (cell.opened) return; // do not check already opened cell
      this.exploreMap(x, y);
    })
  }

  private getNearbySomething(startX: number, startY: number, key: keyof Cell) {
    let nearbySomething = 0;
    this.GetBoundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.getCell(x, y);
      if (cell[key]) nearbySomething++;
    }
    )
    return nearbySomething;
  }

  private getNearbyMines(startX: number, startY: number) {
    return this.getNearbySomething(startX, startY, "mined");
  }

  private getNearbyFlags(startX: number, startY: number) {
    return this.getNearbySomething(startX, startY, "flagged");
  }

  flagAt(x: number, y: number) {
    const cell = this.getCell(x, y);
    if (this.state !== "IN_PROGRESS" || cell.opened) return;
    cell.flagged = !cell.flagged;
  }
}
