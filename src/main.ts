import { GameController } from "./controller";
import { GameModel } from "./model";
import "./style.css";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("canvas is not a canvas");

const model = new GameModel("medium");
new GameController(canvas, model);

