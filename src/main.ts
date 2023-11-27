import {
  drawCanvas,
  getCellNumberByOffset,
  initCanvas,
  renderSelectedCell,
} from "./canvas";
import { CELL_SIZES } from "./consts";
import { GameMap } from "./game.map";
import { images, loadImageResources } from "./resources";
import "./style.css";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("canvas's 2d context is null");

initCanvas(canvas);

let selectedCell: { x: number; y: number };

const map = new GameMap();

loadImageResources((images) => {
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
        map.openAt(x, y);
        break;
      case 2: //right click
        map.flagAt(x, y);
        break;
    }
  };
});

// game loop

function gameLoop() {
  console.debug(performance.now());
  if (!ctx) throw new Error("canvas's 2d context is null");
  render(ctx);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

/**
 * render all types of staff
 */
export function render(
  ctx: CanvasRenderingContext2D
  // cells: Record<string, Cell>
) {
  drawCanvas(ctx, images, map);

  renderSelectedCell(ctx, images.selectedCell, selectedCell, map);
}
