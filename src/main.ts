import { MINES_NUMBER } from "./constants";
import { GameController } from "./controller";
import { GameModel } from "./model";
import "./style.css";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");

const model = new GameModel(MINES_NUMBER);
new GameController(canvas, model);

