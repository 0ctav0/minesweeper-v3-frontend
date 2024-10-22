import {
  drawCanvas,
  getCellNumberByOffset,
  initCanvas,
  initInformationPanel,
  renderSelectedCell,
  WriteMinesLeft,
} from "./view";
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  FPS,
  ID,
} from "./constants";
import { GameModel } from "./model/GameModel";
import { sounds } from "./resources";
import { SoundSystem } from "./sound-system";
import { MenuPopup } from "./menu-popup/menu-popup";
import { getById } from "./helpers";
import { EventType, GameStatus } from "./types";
import { GameState } from "./GameState";

const DELAY_TO_OPEN_MS = 150;


/**
 * Used to interact with user and change the model. Makes View and Model to work together
 */
export class GameController {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lastClickMS: number | null = null;
  selectedCell?: { x: number; y: number };
  model: GameModel;
  soundSystem: SoundSystem;
  menu: MenuPopup;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas's 2d context is null");
    this.ctx = ctx;
    this.model = GameState.Load() ?? GameModel.Create();
    this.soundSystem = new SoundSystem();
    this.menu = new MenuPopup({
      gameController: this,
      onPlay: this.OnPlay
    });
    initCanvas(this.model.gameField.cellsX, this.model.gameField.cellsY, canvas, this.ctx);
    initInformationPanel(this.model.mines);
    this.InitHandlers();
    this.gameLoop();
    this.InitOptionsBtn();
  }

  private OnPlay = () => {
    this.model.NewGame(MenuPopup.GetDifficultyFromInput());
    initCanvas(this.model.gameField.cellsX, this.model.gameField.cellsY, this.canvas, this.ctx);
    this.EnableContextMenu(false);
    this.menu.PreventMenuOpen();
    WriteMinesLeft(this.model.GetFlagsNumber(), this.model.mines);
    this.menu.ToggleShow(false);
  }

  private InitOptionsBtn() {
    getById(ID.optionsBtn).onclick = () => {
      this.InitHandlers();
      this.menu.ToggleShow();
    };
  }

  private GetCellNumberByMouse(event: MouseEvent) {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    const x = getCellNumberByOffset(offsetX, CELL_WIDTH);
    const y = getCellNumberByOffset(offsetY, CELL_HEIGHT);
    return { x, y };
  }

  private InitHandlers() {
    // disable context menu
    this.EnableContextMenu(false);
    // on hover show selected cell
    this.canvas.onmousemove = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      if (x >= 0 && x < this.model.gameField.cellsX && y >= 0 && y < this.model.gameField.cellsY)
        this.selectedCell = { x, y };
    };
    this.canvas.onpointerdown = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      switch (event.button) {
        case 0: // left click
          this.lastClickMS = new Date().getTime();
          break;
        case 2: // right click
          this.model.FlagAt(x, y);
          const flags = this.model.GetFlagsNumber();
          WriteMinesLeft(flags, this.model.mines);
          break;
      }
    };
    this.canvas.onpointerup = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      if (!this.lastClickMS) return;
      const delay = new Date().getTime() - this.lastClickMS;
      this.lastClickMS = null;
      if (delay <= DELAY_TO_OPEN_MS) {
        this.model.OpenAt(x, y);
        this.model.OpenAround(x, y);
      }
      else {
        this.model.FlagAt(x, y);
        const flags = this.model.GetFlagsNumber();
        WriteMinesLeft(flags, this.model.mines);
        navigator.vibrate(5);
      }
    }
    // on save
    document.onvisibilitychange = () => {
      if (document.hidden) {
        GameState.Save(this.model);
      }
    }
  }

  private EnableContextMenu(enable: boolean) {
    this.canvas.oncontextmenu = () => enable;
  }

  private gameLoop = () => {
    this.manageEventQueue();
    this.render();
    setTimeout(() => requestAnimationFrame(this.gameLoop), FPS);
  };

  private manageEventQueue() {
    const event = this.model.eventQueue.pop();
    if (event) {
      switch (event.type) {
        case EventType.DEFEAT:
          this.OnDefeat();
          break;
        case EventType.WIN:
          this.OnWin();
          break;
      }
    }
  }

  private OnDefeat() {
    this.EnableContextMenu(true);
    this.soundSystem.Play(sounds.death);
    this.menu.RequestMenuOpen();
  }

  private OnWin() {
    this.EnableContextMenu(true);
    this.soundSystem.Play(sounds.win);
    this.menu.RequestMenuOpen();
  }

  private render() {
    drawCanvas(this.ctx, this.model);

    if (this.model.status !== GameStatus.IN_PROGRESS && this.model.status !== GameStatus.START) return;

    renderSelectedCell(this);
  }
}
