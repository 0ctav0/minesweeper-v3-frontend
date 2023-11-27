import { initCanvas, initContext } from "./canvas";
import { GameController } from "./controller";
import { Game } from "./game";
import "./style.css";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("canvas's 2d context is null");

initCanvas(canvas);
initContext(ctx);

const game = new Game();
const controller = new GameController(canvas, ctx, game);
(window as any).game = game; // for debug purpose TODO: delete
(window as any).controller = controller; // for debug purpose TODO: delete

// game loop

const gameLoop = () => {
  controller.manageEventQueue();
  controller.render();
  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
