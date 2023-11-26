import { clearAt, drawCells, drawImageAt, initCanvas } from "./canvas";
import { loadImageResources } from "./resources";
import "./style.css";

// const WIDTH = 300;
// const HEIGH = 300;

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("canvas's 2d context is null");
ctx;

initCanvas(canvas);
loadImageResources((images) => {
  drawCells(ctx, images.cell);
  canvas.oncontextmenu = () => false;
  canvas.onmousedown = (event) => {
    console.debug(event);
    event.preventDefault();
    event.stopPropagation();
    const x = event.offsetX;
    const y = event.offsetY;
    clearAt(ctx, x, y);
    switch (event.button) {
      case 0: //left mouse click
        drawImageAt(ctx, images.mine, x, y);
        break;
      case 2: //right click
        drawImageAt(ctx, images.flag, x, y);
        break;
    }
  };
});
