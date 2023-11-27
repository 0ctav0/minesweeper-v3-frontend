import {
  drawCanvas,
  getCellNumberByOffset,
  initCanvas,
  initContext,
  renderSelectedCell,
} from "./canvas";
import {
  CELL_SIZES_X,
  CELL_SIZES_Y,
  CELLS_COUNTS_X,
  CELLS_COUNTS_Y,
} from "./constants";
import { Game } from "./game";
import { images, sounds } from "./resources";
import "./style.css";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("canvas's 2d context is null");

initCanvas(canvas);
initContext(ctx);

let selectedCell: { x: number; y: number };

const game = new Game();
(window as any).game = game; // for debug purpose TODO: delete

// disable context menu
canvas.oncontextmenu = () => false;
// on hover show selected cell
canvas.onmousemove = (event) => {
  const offsetX = event.offsetX;
  const offsetY = event.offsetY;
  const x = getCellNumberByOffset(offsetX, CELL_SIZES_X);
  const y = getCellNumberByOffset(offsetY, CELL_SIZES_Y);
  if (x >= 0 && x < CELLS_COUNTS_X && y >= 0 && y < CELLS_COUNTS_Y)
    selectedCell = { x, y };
};
// on click
canvas.onmousedown = (event) => {
  const offsetX = event.offsetX;
  const offsetY = event.offsetY;
  const x = getCellNumberByOffset(offsetX, CELL_SIZES_X);
  const y = getCellNumberByOffset(offsetY, CELL_SIZES_Y);
  switch (event.button) {
    case 0: //left mouse click
      game.openAt(x, y);
      break;
    case 2: //right click
      game.flagAt(x, y);
      break;
  }
};

// game loop

const gameLoop = () => {
  manageEventQueue();
  render(ctx);
  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

const manageEventQueue = () => {
  const event = game.eventQueue.pop();
  if (event) {
    switch (event.type) {
      case "PLAY_DEATH":
        canvas.oncontextmenu = () => true; // return back context menu
        sounds.death.play();
        break;
      case "WIN":
        canvas.oncontextmenu = () => true; // return back context menu
        sounds.win.play();
        break;
    }
  }
};

/**
 * render all types of staff
 */
export function render(ctx: CanvasRenderingContext2D) {
  drawCanvas(ctx, images, game);

  if (game.state !== "IN_PROGRESS") return;

  renderSelectedCell(ctx, images.selectedCell, selectedCell, game);
}
