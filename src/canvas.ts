import { CELLS_COUNTS, CELL_SIZES, FLAG_SIZES } from "./consts";
import { Game } from "./game";
import { ImagesObject } from "./resources";

export function renderSelectedCell(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  selectedCell: { x: number; y: number },
  game: Game
) {
  if (!selectedCell) return;
  const cell = game.getCell(selectedCell.x, selectedCell.y);
  if (!cell.open && !cell.hasFlag) {
    drawImageAt(ctx, image, selectedCell.x, selectedCell.y);
  }
}

export function drawCanvas(
  ctx: CanvasRenderingContext2D,
  images: ImagesObject,
  game: Game
) {
  for (let x = 0; x < CELLS_COUNTS[0]; x++) {
    for (let y = 0; y < CELLS_COUNTS[1]; y++) {
      const cell = game.getCell(x, y);
      if (cell.open) {
        // open cell
        ctx.clearRect(
          x * CELL_SIZES[0],
          y * CELL_SIZES[1],
          CELL_SIZES[0],
          CELL_SIZES[1]
        );
        if (cell.hasMine) {
          drawImageAt(ctx, images.mine, x, y, CELL_SIZES[0], CELL_SIZES[1]);
        }
      } else {
        // not open cell
        ctx.drawImage(
          images.cell,
          x * CELL_SIZES[0],
          y * CELL_SIZES[1],
          CELL_SIZES[0],
          CELL_SIZES[1]
        );
        if (cell.hasFlag) {
          drawImageAt(ctx, images.flag, x, y, FLAG_SIZES[0], FLAG_SIZES[1]);
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
    getCellPositionOnCanvasByOffset(offsetX, CELL_SIZES[0]),
    getCellPositionOnCanvasByOffset(offsetY, CELL_SIZES[1]),
    CELL_SIZES[0],
    CELL_SIZES[1]
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
    x * CELL_SIZES[0] +
      // if size defined then add padding to put at middle
      (sizeX ? (CELL_SIZES[0] - sizeX) / 2 : 0),
    y * CELL_SIZES[1] + (sizeY ? (CELL_SIZES[1] - sizeY) / 2 : 0),
    sizeX ? sizeX : CELL_SIZES[0],
    sizeY ? sizeY : CELL_SIZES[1]
  );
}

export function initCanvas(canvas: HTMLCanvasElement) {
  canvas.style.background = "grey";
  canvas.width = CELLS_COUNTS[0] * CELL_SIZES[0];
  canvas.height = CELLS_COUNTS[1] * CELL_SIZES[1];
}
