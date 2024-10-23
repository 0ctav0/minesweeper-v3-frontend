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
  clickStartedAt: number = 0;
  isPointerUp: boolean = false;
  selectedCell?: { x: number; y: number };
  pressedCell?: { x: number, y: number };
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
    this.AttachHandlers();
    this.GameLoop();
    this.InitOptionsBtn();
    this.OnSave();
  }

  private OnPlay = () => {
    this.AttachHandlers();
    this.model.NewGame(MenuPopup.GetDifficultyFromInput());
    this.canvas.Init(this.model.gameField.cellsX, this.model.gameField.cellsY);
    writeMinesLeft(this.model.GetFlagsNumber(), this.model.mines);
    this.menu.PreventMenuOpen();
    this.menu.ToggleShow(false);
  }

  private OnOpen = (x: number, y: number) => {
    this.model.OpenAt(x, y);
    this.model.OpenAround(x, y);
  }

  private OnFlag = (x: number, y: number) => {
    const cell = this.model.gameField.GetCell(x, y);
    if (cell.opened) return;
    this.model.FlagAt(x, y);
    navigator.vibrate(5);
    const flags = this.model.GetFlagsNumber();
    writeMinesLeft(flags, this.model.mines);
  }

  private OnSave = () => {
    // on save
    document.onvisibilitychange = () => {
      if (document.hidden) {
        GameState.Save(this.model);
      }
    }
  }

  private InitOptionsBtn() {
    getById(ID.optionsBtn).onclick = () => {
      this.menu.ToggleShow();
    };
  }

  private GetCellNumberByUIEvent(event: MouseEvent | TouchEvent) {
    let offsetX = 0;
    let offsetY = 0;
    if (event instanceof MouseEvent) {
      offsetX = event.offsetX;
      offsetY = event.offsetY;
    } else if (event instanceof TouchEvent) {
      const target = event.target as HTMLElement;
      const bcr = target.getBoundingClientRect();
      offsetX = event.targetTouches[0].clientX - bcr.x;
      offsetY = event.targetTouches[0].clientY - bcr.y;
    }
    else throw new Error("Couldn't determine the type of the event")
    const x = this.canvas.GetCellNumberByOffset(offsetX, CELL_WIDTH);
    const y = this.canvas.GetCellNumberByOffset(offsetY, CELL_HEIGHT);
    return { x, y };
  }

  private AttachHandlers() {
    this.EnableContextMenu(false);
    // on hover show selected cell
    this.canvas.el.onmousemove = (event) => {
      const { x, y } = this.GetCellNumberByUIEvent(event);
      if (x >= 0 && x < this.model.gameField.cellsX && y >= 0 && y < this.model.gameField.cellsY)
        this.selectedCell = { x, y };
    };
    this.canvas.el.onpointerdown = (event) => {
      const { x, y } = this.GetCellNumberByUIEvent(event);
      this.pressedCell = { x, y };
      this.model.SetHighlightAround(x, y, true);
      switch (event.button) {
        case 0: // left click
          this.clickStartedAt = new Date().getTime();
          this.isPointerUp = false;
          this.WaitingClick(x, y);
          break;
        case 2: // right click
          this.OnFlag(x, y);
          break;
      }
    };
    this.canvas.el.ontouchmove = (event) => {
      const { x, y } = this.GetCellNumberByUIEvent(event);
      if (this.pressedCell) {
        this.model.SetHighlightAround(this.pressedCell.x, this.pressedCell.y, false);
      }
      this.model.SetHighlightAround(x, y, true);
      this.pressedCell = { x, y };
    }
    this.canvas.el.ontouchend = () => {
      if (this.pressedCell) {
        this.model.SetHighlightAround(this.pressedCell.x, this.pressedCell.y, false);
      }
      this.pressedCell = undefined;
    }
    this.canvas.el.onpointerup = () => {
      this.isPointerUp = true;
      if (!this.pressedCell) return
      this.model.SetHighlightAround(this.pressedCell.x, this.pressedCell.y, false);
      this.pressedCell = undefined;
    }
  }

  private DetachHandlers() {
    this.EnableContextMenu(true);
    this.canvas.el.onmousemove = null;
    this.canvas.el.onpointerdown = null;
    this.canvas.el.onpointerup = null;
  }

  private EnableContextMenu(enable: boolean) {
    this.canvas.el.oncontextmenu = () => enable;
  }

  private ManageEventQueue() {
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
    this.DetachHandlers();
    this.soundSystem.Play(sounds.death);
    this.menu.RequestMenuOpen();
  }

  private OnWin() {
    this.DetachHandlers();
    this.soundSystem.Play(sounds.win);
    this.menu.RequestMenuOpen();
  }

  // Arrow functions save context compared to classic functions/methods
  private WaitingClick = (x: number, y: number) => {
    const delay = new Date().getTime() - this.clickStartedAt;
    if (this.isPointerUp && delay <= DELAY_TO_OPEN_MS) {
      this.OnOpen(x, y);
      return;
    }
    if (delay > DELAY_TO_OPEN_MS) {
      this.OnFlag(x, y);
      return;
    }
    setTimeout(() => this.WaitingClick(x, y), 5);
  }

  private GameLoop = () => {
    this.ManageEventQueue();
    this.Render();
    setTimeout(() => requestAnimationFrame(this.GameLoop), FPS);
  };

  private Render() {
    this.canvas.Draw(this.model);

    if (this.model.status !== GameStatus.IN_PROGRESS && this.model.status !== GameStatus.START) return;

    this.canvas.RenderSelectedCell(this);
  }
}
