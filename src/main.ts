import { initCanvas, initContext } from "./view";
import { GameController } from "./controller";
import { GameModel } from "./model";
import "./style.css";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("canvas's 2d context is null");

initCanvas(canvas);
initContext(ctx);

const model = new GameModel();
const controller = new GameController(canvas, ctx, model);
(window as any).model = model; // for debug purpose TODO: delete
(window as any).controller = controller; // for debug purpose TODO: delete

const gameLoop = () => {
  controller.manageEventQueue();
  controller.render();
  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
