import { DEFAULT_MINES_NUMBER } from "./constants";
import { GameController } from "./controller";
import { GameModel } from "./model";
import "./style.css";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");

const model = new GameModel(DEFAULT_MINES_NUMBER);
const controller = new GameController(canvas, model);
(window as any).model = model; // for debug purpose TODO: delete
(window as any).controller = controller; // for debug purpose TODO: delete
