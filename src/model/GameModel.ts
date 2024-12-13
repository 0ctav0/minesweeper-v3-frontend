import { DifficultyMines } from "../constants";
import { random } from "../helpers";
import { Event, GameStatus, Difficulty, EventType } from "../types";
import { Cell } from "./Cell";
import { GameField } from "./GameField";

/**
 * Contains all game's data and logic related to game mechanics
*/
export class GameModel {
  status: GameStatus;
  difficulty: Difficulty;
  eventQueue: Event[] = [];
  mines: number;
  gameField: GameField;

  constructor(status: GameStatus, difficulty: Difficulty, eventQueue: Event[], gameField?: GameField, mines?: number) {
    this.status = status;
    this.difficulty = difficulty;
    this.eventQueue = eventQueue;
    this.gameField = gameField ?? GameField.Create();
    this.mines = mines ?? this.GetMinesNumber(difficulty);
  }

  static Create() {
    return new GameModel(GameStatus.START, Difficulty.MEDIUM, []);
  }

  NewGame(difficulty: Difficulty) {
    this.status = GameStatus.START;
    this.difficulty = difficulty;
    this.gameField = GameField.Create();
    this.mines = this.GetMinesNumber(difficulty);
  }

  private GetMinesNumber(difficulty: Difficulty) {
    return Math.floor(this.gameField.cellsX * this.gameField.cellsY / 100 * DifficultyMines[difficulty]);
  }

  private IsInArea(originX: number, checkedX: number, originY: number, checkedY: number): boolean {
    const SAFE_AREA = 1;
    return this.gameField.GetAroundIterator(originX, originY, SAFE_AREA)
      .some(({ x, y }) => x == checkedX && y == checkedY
      )
  }

  private GenerateMines(originX: number, originY: number) {
    let i = 0;
    while (i < this.mines) {
      const x = random(0, this.gameField.cellsX);
      const y = random(0, this.gameField.cellsY);
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
    const nearbyMines = this.GetNearbyMines(startX, startY);
    const nearbyFlags = this.GetNearbyFlags(startX, startY);
    if (nearbyMines !== nearbyFlags) return;
    this.gameField.GetAroundIterator(startX, startY).map(({ x, y }) => {
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
        this.eventQueue.push({ type: EventType.DEFEAT, x, y });
      } else {
        this.ExploreMap(x, y);
        if (this.IsWin()) {
          this.status = GameStatus.WIN;
          this.eventQueue.push({ type: EventType.WIN });
        }
      }
    }
  }

  FlagAt(x: number, y: number) {
    const cell = this.gameField.GetCell(x, y);
    if (this.status !== GameStatus.IN_PROGRESS || cell.opened) return;
    cell.flagged = !cell.flagged;
  }

  SetHighlightAround(originX: number, originY: number, value: boolean) {
    const cell = this.gameField.GetCell(originX, originY);
    if (!cell.opened) return;
    this.gameField.GetAroundIterator(originX, originY).map(({ x, y }) => {
      if (originX === x && originY === y) return;
      const cell = this.gameField.GetCell(x, y);
      cell.highlighted = value;
    })
  }

  private IsWin() {
    let opened = 0;
    this.gameField.GetIterator().map(({ x, y }) => {
      const cell = this.gameField.GetCell(x, y);
      if (cell.opened) opened++;
    });
    return this.gameField.cellsX * this.gameField.cellsY - opened === this.mines;
  }

  GetFlagsNumber() {
    let flags = 0;
    this.gameField.GetIterator().map(({ x, y }) => {
      const cell = this.gameField.GetCell(x, y);
      if (cell.flagged) flags++;
    });
    return flags;
  }

  private ExploreMap(startX: number, startY: number) {
    const startingCell = this.gameField.GetCell(startX, startY);
    const mines = this.GetNearbyMines(startX, startY);
    startingCell.opened = true;
    if (mines) {
      startingCell.nearbyMines = mines;
      return;
    }
    this.gameField.GetAroundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.gameField.GetCell(x, y);
      if (cell.opened) return; // do not check already opened cell
      this.ExploreMap(x, y);
    })
  }

  private GetNearbySomething(startX: number, startY: number, key: keyof Cell) {
    let nearbySomething = 0;
    this.gameField.GetAroundIterator(startX, startY).map(({ x, y }) => {
      const cell = this.gameField.GetCell(x, y);
      if (cell[key]) nearbySomething++;
    }
    )
    return nearbySomething;
  }

  private GetNearbyMines(startX: number, startY: number) {
    return this.GetNearbySomething(startX, startY, "mined");
  }

  private GetNearbyFlags(startX: number, startY: number) {
    return this.GetNearbySomething(startX, startY, "flagged");
  }
}
