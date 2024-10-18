import {
  drawCanvas,
  getCellNumberByOffset,
  initCanvas,
  initContext,
  initInformationPanel,
  renderSelectedCell,
  WriteMinesLeft,
} from "./view";
import {
  CELLS_X,
  CELLS_Y,
  CELL_WIDTH,
  CELL_HEIGHT,
  FPS,
  ID,
} from "./constants";
import { GameModel } from "./model";
import { sounds } from "./resources";
import { SoundSystem } from "./sound-system";
import { MenuPopup } from "./menu-popup/menu-popup";
import { getById } from "./helpers";
import { Storage } from "./Storage";
import { EventType, GameStatus } from "./types";
import { GameState } from "./GameState";


/**
 * Used to interact with user and change the model. Makes View and Model to work together
 */
export class GameController {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  selectedCell?: { x: number; y: number };
  model: GameModel;
  soundSystem: SoundSystem;
  menu: MenuPopup;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas's 2d context is null");
    this.ctx = ctx;
    this.model = GameState.Load() ?? GameModel.Create(Storage.GetDifficulty());
    this.soundSystem = new SoundSystem();
    this.menu = new MenuPopup({
      gameController: this,
      onPlay: this.OnPlay
    });

    initCanvas(canvas);
    initContext(ctx);
    initInformationPanel(this.model.mines);
    this.initHandlers();
    this.gameLoop();
    this.InitOptionsBtn();
  }

  private OnPlay = () => {
    this.model.NewGame(Storage.GetDifficulty());
    this.EnableContextMenu(false);
    this.menu.PreventMenuOpen();
    WriteMinesLeft(this.model.getFlagsNumber(), this.model.mines);
    this.menu.ToggleShow(false);
  }

  private InitOptionsBtn() {
    getById(ID.optionsBtn).onclick = () => {
      this.initHandlers();
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

  private initHandlers() {
    // disable context menu
    this.EnableContextMenu(false);
    // on hover show selected cell
    this.canvas.onmousemove = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      if (x >= 0 && x < CELLS_X && y >= 0 && y < CELLS_Y)
        this.selectedCell = { x, y };
    };
    // on click
    this.canvas.onmousedown = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      switch (event.button) {
        case 2: //right click
          this.model.FlagAt(x, y);
          const flags = this.model.getFlagsNumber();
          WriteMinesLeft(flags, this.model.mines);
          break;
      }
    };
    this.canvas.onclick = (event) => {
      const { x, y } = this.GetCellNumberByMouse(event);
      this.model.OpenAt(x, y);
      this.model.OpenAround(x, y);
    };
    // on save
    window.onbeforeunload = () => {
      GameState.Save(this.model);
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
