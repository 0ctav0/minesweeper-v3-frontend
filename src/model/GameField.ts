import { CELL_HEIGHT, CELL_WIDTH } from "../constants";
import { CallbackControlRes } from "../types";
import { Cell } from "./Cell";

const OFFSET_X = 20;
const OFFSET_Y = 40;

const CELLS_X_MAX = 20;
const CELLS_Y_MAX = 24;

const GetDefaultCellsX = () => Math.min(Math.floor((window.innerWidth - OFFSET_X) / CELL_WIDTH), CELLS_X_MAX);
const GetDefaultCellsY = () => Math.min(Math.floor((window.innerHeight - OFFSET_Y) / CELL_HEIGHT), CELLS_Y_MAX);

type FilterControl = (x: number, y: number) => CallbackControlRes;
type GenericIteratorParam = {
    minX: number, maxX: number,
    minY: number, maxY: number,
    filter?: FilterControl
}
type IteratorRes = { x: number, y: number };

export class GameField {
    cellsX: number;
    cellsY: number;
    private cells: Record<string, Cell>;

    constructor(x: number, y: number, cells: Record<string, Cell>) {
        this.cellsX = x;
        this.cellsY = y;
        this.cells = cells;
    }

    static Create(): GameField {
        const cellsX = GetDefaultCellsX();
        const cellsY = GetDefaultCellsY();
        const gameField = new GameField(cellsX, cellsY, {});
        for (let x = 0; x < cellsX; x++) {
            for (let y = 0; y < cellsY; y++) {
                gameField.SetCell(x, y, Cell.Create());
            }
        }
        return gameField;
    }

    GetCell(x: number, y: number) {
        return this.cells[String(x) + "," + String(y)];
    }

    SetCell(x: number, y: number, cell: Cell) {
        this.cells[String(x) + "," + String(y)] = cell;
    }

    GetIterator(filter?: FilterControl) {
        return this.GetGenericIterator({ minX: 0, maxX: this.cellsX - 1, minY: 0, maxY: this.cellsY - 1, filter })
    }

    GetAroundIterator(originX: number, originY: number, step: number = 1, filter?: FilterControl) {
        const minX = Math.max(0, originX - step);
        const maxX = Math.min(originX + step, this.cellsX - 1);
        const minY = Math.max(0, originY - step);
        const maxY = Math.min(originY + step, this.cellsY - 1);
        return this.GetGenericIterator({ minX, maxX, minY, maxY, filter })
    }

    private GetGenericIterator(param: GenericIteratorParam): IteratorRes[] {
        const result: IteratorRes[] = [];
        for (let x = param.minX; x <= param.maxX; x++) {
            for (let y = param.minY; y <= param.maxY; y++) {
                if (param.filter) {
                    const control = param.filter(x, y);
                    if (control === "break") break;
                    if (control === "continue") continue;
                }
                result.push({ x, y });
            }
        }
        return result;
    }
}