import {
  drawCanvas,
  getCellNumberByOffset,
  initCanvas,
  initContext,
  renderSelectedCell,
} from "./canvas";
import { CELL_SIZES } from "./constants";
import { Game } from "./game";
import { images, sounds, loadResources } from "./resources";
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

loadResources(() => {
  render(ctx);
  // disable context menu
  canvas.oncontextmenu = () => false;
  // on hover show selected cell
  canvas.onmousemove = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    selectedCell = {
      x: getCellNumberByOffset(x, CELL_SIZES[0]),
      y: getCellNumberByOffset(y, CELL_SIZES[1]),
    };
  };
  // on click
  canvas.onmousedown = (event) => {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    const x = getCellNumberByOffset(offsetX, CELL_SIZES[0]);
    const y = getCellNumberByOffset(offsetY, CELL_SIZES[1]);
    switch (event.button) {
      case 0: //left mouse click
        game.openAt(x, y);
        break;
      case 2: //right click
        game.flagAt(x, y);
        break;
    }
  };
});

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
