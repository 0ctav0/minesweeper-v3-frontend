import {
  drawCanvas,
  getCellNumberByOffset,
  getMinesFromInput,
  initCanvas,
  initContext,
  initInformationPanel,
  renderSelectedCell,
  writeMinesText,
} from "./view";
import {
  CELLS_X,
  CELLS_Y,
  CELL_WIDTH,
  CELL_HEIGHT,
  FPS,
} from "./constants";
import { GameModel } from "./model";
import { sounds } from "./resources";
import { SoundSystem } from "./sound-system";


/**
 * Used to interact with user and change the model. Makes View and Model to work together
 */
export class GameController {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  selectedCell?: { x: number; y: number };
  model: GameModel;
  soundSystem: SoundSystem;

  constructor(canvas: HTMLCanvasElement, model: GameModel) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas's 2d context is null");
    this.ctx = ctx;
    this.model = model;
    this.soundSystem = new SoundSystem();

    initCanvas(canvas);
    initContext(ctx);
    initInformationPanel(model.mines);
    this.initHandlers();
    this.gameLoop();
    this.initStartBtn();
  }

  private initStartBtn() {
    const startBtn = document.querySelector("#start-btn") as HTMLElement;
    startBtn.onclick = () => {
      const mines = getMinesFromInput();
      this.initHandlers();
      writeMinesText(0, mines);
      this.model.newGame(mines);
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
    this.canvas.oncontextmenu = () => false;
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
          writeMinesText(flags, this.model.mines);
          break;
      }
    };
    this.canvas.onclick = (event) => {
      const { x, y } = this.getCellNumberByMouse(event);
      this.model.openAt(x, y);
      this.model.openAround(x, y);
    };
  }

  private detachHandlers() {
    this.canvas.oncontextmenu = () => true; // return back context menu
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
        case "PLAY_DEATH":
          this.detachHandlers();
          this.soundSystem.Play(sounds.death);
          break;
        case "WIN":
          this.detachHandlers();
          this.soundSystem.Play(sounds.win);
          break;
      }
    }
  }

  private render() {
    drawCanvas(this.ctx, this.model);

    if (this.model.state !== "IN_PROGRESS") return;

    renderSelectedCell(this);
  }
}
