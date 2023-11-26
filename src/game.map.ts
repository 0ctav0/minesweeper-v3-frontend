import { CELLS_COUNTS, MINES_NUMBER } from "./consts";
import { random } from "./helpers";

export class Cell {
  hasMine: boolean;
  hasFlag = false;
  open = false;

  constructor(mine: boolean) {
    this.hasMine = mine;
  }
}

export class GameMap {
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
      if (cell && cell.hasMine) {
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
    if (!cell.hasFlag) {
      cell.open = true;
    }
    //explore map
  }

  flagAt(x: number, y: number) {
    this.getCell(x, y).hasFlag = true;
  }
}
