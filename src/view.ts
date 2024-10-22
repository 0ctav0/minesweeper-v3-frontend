import {
  BACKGROUND_COLOR,
  CELL_WIDTH,
  CELL_HEIGHT,
  COLOR_NUMBERS,
  FLAG_SIZES_X,
  FLAG_SIZES_Y,
  NUMBER_FONT,
  NUMBER_X_OFFSET,
  NUMBER_Y_OFFSET,
} from "./constants";
import { GameController } from "./controller";
import { GameModel } from "./model/GameModel";
import { images } from "./resources";

export function renderSelectedCell(controller: GameController) {
  const { ctx, selectedCell, model } = controller;
  if (!selectedCell) return;
  const cell = model.gameField.GetCell(selectedCell.x, selectedCell.y);
  if (!cell.opened && !cell.flagged) {
    drawImageAt(ctx, images.selectedCell, selectedCell.x, selectedCell.y);
  }
}

/**
 * Called each frame, in game loop
 */
export function drawCanvas(ctx: CanvasRenderingContext2D, model: GameModel) {
  for (let x = 0; x < model.gameField.cellsX; x++) {
    for (let y = 0; y < model.gameField.cellsY; y++) {
      const cell = model.gameField.GetCell(x, y);
      if (cell.opened) {
        // open cell
        ctx.clearRect(
          x * CELL_WIDTH,
          y * CELL_HEIGHT,
          CELL_WIDTH,
          CELL_HEIGHT
        );
        if (cell.mined) {
          drawImageAt(ctx, images.mine, x, y, CELL_WIDTH, CELL_HEIGHT);
        } else if (cell.nearbyMines) {
          ctx.fillStyle = COLOR_NUMBERS[cell.nearbyMines - 1];
          ctx.fillText(
            String(cell.nearbyMines),
            x * CELL_WIDTH + NUMBER_X_OFFSET,
            y * CELL_HEIGHT + NUMBER_Y_OFFSET
          );
          ctx.fillStyle = BACKGROUND_COLOR;
        }
      } else {
        // not open cell
        ctx.drawImage(
          images.cell,
          x * CELL_WIDTH,
          y * CELL_HEIGHT,
          CELL_WIDTH,
          CELL_HEIGHT
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
    getCellPositionOnCanvasByOffset(offsetX, CELL_WIDTH),
    getCellPositionOnCanvasByOffset(offsetY, CELL_HEIGHT),
    CELL_WIDTH,
    CELL_HEIGHT
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
    x * CELL_WIDTH +
    // if size defined then add padding to put at middle
    (sizeX ? (CELL_WIDTH - sizeX) / 2 : 0),
    y * CELL_HEIGHT + (sizeY ? (CELL_HEIGHT - sizeY) / 2 : 0),
    sizeX ? sizeX : CELL_WIDTH,
    sizeY ? sizeY : CELL_HEIGHT
  );
}

export function initCanvas(cellsX: number, cellsY: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  canvas.style.background = BACKGROUND_COLOR;
  canvas.width = cellsX * CELL_WIDTH;
  canvas.height = cellsY * CELL_HEIGHT;
  ctx.font = NUMBER_FONT;
}

export function initInformationPanel(mines: number) {
  const panel = document.querySelector("#info-panel");
  if (!panel) throw new Error("info panel is not found");
  WriteMinesLeft(0, mines);
}

export function WriteMinesLeft(flags: number, mines: number) {
  const flagsText = document.querySelector("#flags");
  // const minesInput = document.querySelector("#mines-input");
  if (!flagsText) throw new Error("flag text is not found");
  // if (!minesInput || !(minesInput instanceof HTMLInputElement))
  // throw new Error("mines input is not found");
  flagsText.textContent = `${mines - flags}`;
  // minesInput.value = String(mines);
}

export function getMinesFromInput() {
  const minesInput = document.querySelector("#mines-input");
  if (!minesInput || !(minesInput instanceof HTMLInputElement))
    throw new Error("mines input is not found");
  return parseInt(minesInput.value, 10);
}
