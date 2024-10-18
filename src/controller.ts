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

  constructor(canvas: HTMLCanvasElement, model: GameModel) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas's 2d context is null");
    this.ctx = ctx;
    this.model = model;
    this.soundSystem = new SoundSystem();
    this.menu = new MenuPopup({
      gameController: this,
      onPlay: this.OnPlay
    });

    initCanvas(canvas);
    initContext(ctx);
    initInformationPanel(model.mines);
    this.initHandlers();
    this.gameLoop();
    this.InitOptionsBtn();
  }

  private OnPlay = () => {
    this.model.newGame(Storage.GetDifficulty());
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

  private getCellNumberByMouse(event: MouseEvent) {
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
      const { x, y } = this.getCellNumberByMouse(event);
      if (x >= 0 && x < CELLS_X && y >= 0 && y < CELLS_Y)
        this.selectedCell = { x, y };
    };
    // on click
    this.canvas.onmousedown = (event) => {
      const { x, y } = this.getCellNumberByMouse(event);
      switch (event.button) {
        case 2: //right click
          this.model.flagAt(x, y);
          const flags = this.model.getFlagsNumber();
          WriteMinesLeft(flags, this.model.mines);
          break;
      }
    };
    this.canvas.onclick = (event) => {
      const { x, y } = this.getCellNumberByMouse(event);
      this.model.openAt(x, y);
      this.model.openAround(x, y);
    };
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
        case "DEFEAT":
          this.OnDefeat();
          break;
        case "WIN":
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

    if (this.model.state !== "IN_PROGRESS" && this.model.state !== "START") return;

    renderSelectedCell(this);
  }
}
