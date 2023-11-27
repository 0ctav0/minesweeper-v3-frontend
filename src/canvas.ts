import {
  BACKGROUND_COLOR,
  CELLS_COUNTS_X,
  CELLS_COUNTS_Y,
  CELL_SIZES_X,
  CELL_SIZES_Y,
  COLOR_NUMBERS,
  FLAG_SIZES_X,
  FLAG_SIZES_Y,
  NUMBER_FONT,
  NUMBER_X_OFFSET,
  NUMBER_Y_OFFSET,
} from "./constants";
import { GameController } from "./controller";
import { Game } from "./game";
import { images } from "./resources";

export function renderSelectedCell(controller: GameController) {
  const { ctx, selectedCell, model } = controller;
  if (!selectedCell) return;
  const cell = model.getCell(selectedCell.x, selectedCell.y);
  if (!cell.opened && !cell.flagged) {
    drawImageAt(ctx, images.selectedCell, selectedCell.x, selectedCell.y);
  }
}

export function drawCanvas(ctx: CanvasRenderingContext2D, model: Game) {
  for (let x = 0; x < CELLS_COUNTS_X; x++) {
    for (let y = 0; y < CELLS_COUNTS_Y; y++) {
      const cell = model.getCell(x, y);
      if (cell.opened) {
        // open cell
        ctx.clearRect(
          x * CELL_SIZES_X,
          y * CELL_SIZES_Y,
          CELL_SIZES_X,
          CELL_SIZES_Y
        );
        if (cell.mined) {
          drawImageAt(ctx, images.mine, x, y, CELL_SIZES_X, CELL_SIZES_Y);
        } else if (cell.nearbyMines) {
          ctx.fillStyle = COLOR_NUMBERS[cell.nearbyMines - 1];
          ctx.fillText(
            String(cell.nearbyMines),
            x * CELL_SIZES_X + NUMBER_X_OFFSET,
            y * CELL_SIZES_Y + NUMBER_Y_OFFSET
          );
          ctx.fillStyle = BACKGROUND_COLOR;
        }
      } else {
        // not open cell
        ctx.drawImage(
          images.cell,
          x * CELL_SIZES_X,
          y * CELL_SIZES_Y,
          CELL_SIZES_X,
          CELL_SIZES_Y
        );
        if (cell.flagged) {
          drawImageAt(ctx, images.flag, x, y, FLAG_SIZES_X, FLAG_SIZES_Y);
        }
      }
    }
  }
}

export function getCellNumberByOffset(offset: number, cellSize: number) {
  return Math.floor(offset / cellSize);
}

export function getCellPositionOnCanvasByOffset(
  offset: number,
  cellSize: number
) {
  return getCellNumberByOffset(offset, cellSize) * cellSize;
}

export function clearAtByOffset(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number
) {
  ctx.clearRect(
    getCellPositionOnCanvasByOffset(offsetX, CELL_SIZES_X),
    getCellPositionOnCanvasByOffset(offsetY, CELL_SIZES_Y),
    CELL_SIZES_X,
    CELL_SIZES_Y
  );
}

export function drawImageAt(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  sizeX?: number,
  sizeY?: number
) {
  ctx.drawImage(
    image,
    x * CELL_SIZES_X +
      // if size defined then add padding to put at middle
      (sizeX ? (CELL_SIZES_X - sizeX) / 2 : 0),
    y * CELL_SIZES_Y + (sizeY ? (CELL_SIZES_Y - sizeY) / 2 : 0),
    sizeX ? sizeX : CELL_SIZES_X,
    sizeY ? sizeY : CELL_SIZES_Y
  );
}

export function initContext(ctx: CanvasRenderingContext2D) {
  ctx.font = NUMBER_FONT;
}

export function initCanvas(canvas: HTMLCanvasElement) {
  canvas.style.background = BACKGROUND_COLOR;
  canvas.width = CELLS_COUNTS_X * CELL_SIZES_X;
  canvas.height = CELLS_COUNTS_Y * CELL_SIZES_Y;
}
