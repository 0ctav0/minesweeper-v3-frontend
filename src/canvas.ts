import { CELLS_COUNTS, CELL_SIZES } from "./consts";

export function drawCells(
  ctx: CanvasRenderingContext2D,
  cellImage: HTMLImageElement
) {
  for (let i = 0; i < CELLS_COUNTS[0]; i++) {
    for (let j = 0; j < CELLS_COUNTS[1]; j++) {
      ctx.drawImage(
        cellImage,
        i * CELL_SIZES[0],
        j * CELL_SIZES[1],
        CELL_SIZES[0],
        CELL_SIZES[1]
      );
    }
  }
}

export function clearAt(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number
) {
  ctx.clearRect(
    Math.floor(offsetX / CELL_SIZES[0]) * CELL_SIZES[0],
    Math.floor(offsetY / CELL_SIZES[1]) * CELL_SIZES[1],
    CELL_SIZES[0],
    CELL_SIZES[1]
  );
}

export function drawImageAt(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  offsetX: number,
  offsetY: number
) {
  ctx.drawImage(
    image,
    Math.floor(offsetX / CELL_SIZES[0]) * CELL_SIZES[0],
    Math.floor(offsetY / CELL_SIZES[1]) * CELL_SIZES[1],
    CELL_SIZES[0],
    CELL_SIZES[1]
  );
}

export function initCanvas(canvas: HTMLCanvasElement) {
  canvas.width = CELLS_COUNTS[0] * CELL_SIZES[0];
  canvas.height = CELLS_COUNTS[1] * CELL_SIZES[1];
}
