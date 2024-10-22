import {
  Canvas,
} from "./Canvas";
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
import { initInformationPanel, writeMinesLeft } from "./ui/ui";

const DELAY_TO_OPEN_MS = 150;


/**
 * Used to interact with user and change the model. Makes View and Model to work together
 */
export class GameController {
  canvas: Canvas;
  lastClickMS: number | null = null;
  selectedCell?: { x: number; y: number };
  model: GameModel;
  soundSystem: SoundSystem;
  menu: MenuPopup;

  constructor() {
    this.canvas = new Canvas;
    this.model = GameState.Load() ?? GameModel.Create();
    this.soundSystem = new SoundSystem();
    this.menu = new MenuPopup({
      gameController: this,
      onPlay: this.OnPlay
    });
    this.canvas.Init(this.model.gameField.cellsX, this.model.gameField.cellsY);
    initInformationPanel(this.model.mines);
    this.InitHandlers();
    this.gameLoop();
    this.InitOptionsBtn();
  }

  private OnPlay = () => {
    this.model.NewGame(MenuPopup.GetDifficultyFromInput());
    this.canvas.Init(this.model.gameField.cellsX, this.model.gameField.cellsY);
    this.EnableContextMenu(false);
    this.menu.PreventMenuOpen();
    writeMinesLeft(this.model.GetFlagsNumber(), this.model.mines);
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
    const x = this.canvas.GetCellNumberByOffset(offsetX, CELL_WIDTH);
    const y = this.canvas.GetCellNumberByOffset(offsetY, CELL_HEIGHT);
    return { x, y };
  }

  private InitHandlers() {
    // disable context menu
    this.EnableContextMenu(false);
    // on hover show selected cell
    this.canvas.el.onmousemove = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      if (x >= 0 && x < this.model.gameField.cellsX && y >= 0 && y < this.model.gameField.cellsY)
        this.selectedCell = { x, y };
    };
    this.canvas.el.onpointerdown = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      switch (event.button) {
        case 0: // left click
          this.lastClickMS = new Date().getTime();
          break;
        case 2: // right click
          this.model.FlagAt(x, y);
          const flags = this.model.GetFlagsNumber();
          writeMinesLeft(flags, this.model.mines);
          break;
      }
    };
    this.canvas.el.onpointerup = (event) => {
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
        writeMinesLeft(flags, this.model.mines);
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
    this.canvas.el.oncontextmenu = () => enable;
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
    this.canvas.Draw(this.model);

    if (this.model.status !== GameStatus.IN_PROGRESS && this.model.status !== GameStatus.START) return;

    this.canvas.RenderSelectedCell(this);
  }
}
