import { CELLS_X, CELLS_Y, getMinesNumber } from "./constants";
import { random } from "./helpers";
import { Event, GameStatus, Difficulty, EventType } from "./types";

export class Cell {
  mined: boolean;
  flagged: boolean;
  opened: boolean;
  nearbyMines: number;

  constructor(mined: boolean, flagged: boolean, opened: boolean, nearbyMines: number) {
    this.mined = mined;
    this.flagged = flagged;
    this.opened = opened;
    this.nearbyMines = nearbyMines;
  }

  static Create() {
    return new Cell(false, false, false, 0);
  }
}

export class GameField {
  private cells: Record<string, Cell>;

  constructor(cells: Record<string, Cell>) {
    this.cells = cells;
  }

  static Create(): GameField {
    const gameField = new GameField({});
    for (let x = 0; x < CELLS_X; x++) {
      for (let y = 0; y < CELLS_Y; y++) {
        gameField.SetCell(x, y, Cell.Create());
      }
    }
    return gameField;
  }

  GetCell(x: number, y: number) {
    return this.cells[String(x) + "," + String(y)];
  }

  SetCell(x: number, y: number, cell: Cell) {
    this.cells[String(x) + "," + String(y)] = cell;
  }
}


/**
 * Contains all game's data and logic related to game mechanics
*/
export class GameModel {
  status: GameStatus;
  difficulty: Difficulty;
  eventQueue: Event[] = [];
  mines: number;
  gameField: GameField;

  constructor(status: GameStatus, difficulty: Difficulty, eventQueue: Event[], mines: number, gameField?: GameField) {
    this.status = status;
    this.difficulty = difficulty;
    this.eventQueue = eventQueue;
    this.mines = mines;
    this.gameField = gameField ?? GameField.Create();
  }

  static Create(difficulty: Difficulty) {
    return new GameModel(GameStatus.START, difficulty, [], getMinesNumber(difficulty));
  }

  NewGame(difficulty: Difficulty) {
    this.mines = getMinesNumber(difficulty);
    this.status = GameStatus.START;
    this.difficulty = difficulty;
    this.gameField = GameField.Create();
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
      const cell = this.gameField.GetCell(x, y);
      if (cell.mined || this.IsInArea(originX, x, originY, y)) {
        continue;
      }
      cell.mined = true;
      i++;
    }
  }

  OpenAround(startX: number, startY: number) {
    const startingCell = this.gameField.GetCell(startX, startY);
    if (this.status !== GameStatus.IN_PROGRESS || !startingCell.opened) return;
    const nearbyMines = this.getNearbyMines(startX, startY);
    const nearbyFlags = this.getNearbyFlags(startX, startY);
    if (nearbyMines !== nearbyFlags) return;
    this.GetBoundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.gameField.GetCell(x, y);
      if (cell.opened) return; // do not check already opened cell
      this.OpenAt(x, y);
    }
    );
  }

  OpenAt(x: number, y: number) {
    const cell = this.gameField.GetCell(x, y);
    if (this.status == GameStatus.START) {
      this.GenerateMines(x, y);
      this.status = GameStatus.IN_PROGRESS;
    }
    if (this.status !== GameStatus.IN_PROGRESS || cell.opened) return;
    if (!cell.flagged) {
      cell.opened = true;
      if (cell.mined) {
        this.status = GameStatus.DEFEAT;
        this.eventQueue.push({ type: EventType.DEFEAT });
      } else {
        this.exploreMap(x, y);
        if (this.isWin()) {
          this.status = GameStatus.WIN;
          this.eventQueue.push({ type: EventType.WIN });
        }
      }
    }
  }

  private isWin() {
    let opened = 0;
    for (let x = 0; x < CELLS_X; x++) {
      for (let y = 0; y < CELLS_Y; y++) {
        const cell = this.gameField.GetCell(x, y);
        if (cell.opened) opened++;
      }
    }
    return CELLS_X * CELLS_Y - opened === this.mines;
  }

  getFlagsNumber() {
    let flags = 0;
    for (let x = 0; x < CELLS_X; x++) {
      for (let y = 0; y < CELLS_Y; y++) {
        const cell = this.gameField.GetCell(x, y);
        if (cell.flagged) flags++;
      }
    }
    return flags;
  }

  private exploreMap(startX: number, startY: number) {
    const startingCell = this.gameField.GetCell(startX, startY);
    const mines = this.getNearbyMines(startX, startY);
    startingCell.opened = true;
    if (mines) {
      startingCell.nearbyMines = mines;
      return;
    }
    this.GetBoundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.gameField.GetCell(x, y);
      if (cell.opened) return; // do not check already opened cell
      this.exploreMap(x, y);
    })
  }

  private getNearbySomething(startX: number, startY: number, key: keyof Cell) {
    let nearbySomething = 0;
    this.GetBoundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.gameField.GetCell(x, y);
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

  FlagAt(x: number, y: number) {
    const cell = this.gameField.GetCell(x, y);
    if (this.status !== GameStatus.IN_PROGRESS || cell.opened) return;
    cell.flagged = !cell.flagged;
  }
}
