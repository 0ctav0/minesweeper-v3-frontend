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
  CELLS_COUNTS_X,
  CELLS_COUNTS_Y,
  CELL_SIZES_X,
  CELL_SIZES_Y,
} from "./constants";
import { GameModel } from "./model";
import { sounds } from "./resources";

/**
 * Used to interact with user and change the model. Makes View and Model to work together
 */
export class GameController {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  selectedCell?: { x: number; y: number };
  model: GameModel;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    model: GameModel
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.model = model;

    initCanvas(canvas);
    initContext(ctx);
    initInformationPanel(model.mines);
    this.initHandlers();

    const startBtn = document.querySelector("#start-btn");
    if (!startBtn || !(startBtn instanceof HTMLButtonElement))
      throw new Error("Start button is not found");

    startBtn.onclick = () => {
      const mines = getMinesFromInput();
      this.initHandlers();
      writeMinesText(0, mines);
      this.model.newGame(mines);
    };
  }

  private initHandlers() {
    // disable context menu
    this.canvas.oncontextmenu = () => false;
    // on hover show selected cell
    this.canvas.onmousemove = (event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const x = getCellNumberByOffset(offsetX, CELL_SIZES_X);
      const y = getCellNumberByOffset(offsetY, CELL_SIZES_Y);
      if (x >= 0 && x < CELLS_COUNTS_X && y >= 0 && y < CELLS_COUNTS_Y)
        this.selectedCell = { x, y };
    };
    // on click
    this.canvas.onmousedown = (event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const x = getCellNumberByOffset(offsetX, CELL_SIZES_X);
      const y = getCellNumberByOffset(offsetY, CELL_SIZES_Y);
      switch (event.button) {
        case 0: //left mouse click
          this.model.openAt(x, y);
          break;
        case 2: //right click
          this.model.flagAt(x, y);
          const flags = this.model.getFlagsNumber();
          writeMinesText(flags, this.model.mines);
          break;
      }
    };
  }

  private detachHandlers() {
    this.canvas.oncontextmenu = () => true; // return back context menu
  }

  manageEventQueue() {
    const event = this.model.eventQueue.pop();
    if (event) {
      switch (event.type) {
        case "PLAY_DEATH":
          this.detachHandlers();
          sounds.death.load();
          sounds.death.play();
          break;
        case "WIN":
          this.detachHandlers();
          sounds.win.load();
          sounds.win.play();
          break;
      }
    }
  }

  /**
   * render all types of staff
   */
  render() {
    drawCanvas(this.ctx, this.model);

    if (this.model.state !== "IN_PROGRESS") return;

    renderSelectedCell(this);
  }
}
