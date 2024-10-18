import { CELLS_X, CELLS_Y } from "./constants";
import { Cell, GameField, GameModel } from "./model";
import { Storage } from "./Storage";
import { EventType, GameStatus } from "./types";

// format [] - byte
// [state]
const state_B = 1;
// after F5 page reload, load event. For win status: play win, for defeat: play defeat ...
// [state-event] 0 - none, 1 - defeat, 2 - win
const stateEvent_B = 1;
// [difficulty]
const difficulty_B = 1;
// [mines]
const mines_B = 1;
// [x][y][cell.mined(1), cell.flagged(1), cell.opened(1), cell.reserved(1), cell.nearbyMines(4)]...
const xy_B = 2;
const cells_B = CELLS_X * CELLS_Y;

const NEED_BYTES = state_B + stateEvent_B + difficulty_B + mines_B + xy_B + cells_B;

const saveKey = "save";

export class GameState {
    static Save(model: GameModel) {
        const view = new Uint8Array(NEED_BYTES);
        let offset = 0;
        view[offset++] = model.status;
        const eventType: EventType = model.status === GameStatus.DEFEAT ? EventType.DEFEAT : model.status === GameStatus.WIN ? EventType.WIN : EventType.NONE;
        view[offset++] = eventType;
        view[offset++] = model.difficulty;
        view[offset++] = model.mines;
        view[offset++] = CELLS_X;
        view[offset++] = CELLS_Y;
        for (let x = 0; x < CELLS_X; x++) {
            for (let y = 0; y < CELLS_Y; y++) {
                const cell = model.gameField.GetCell(x, y);
                const bitField = Number(cell.mined)
                    + (Number(cell.flagged) << 1)
                    + (Number(cell.opened) << 2)
                    + (cell.nearbyMines << 3);
                view[offset++] = bitField;
            }
        }
        const base64 = btoa(String.fromCharCode(...view))
        Storage.SetItem(saveKey, base64);
    }

    static Load(): GameModel | null {
        try {
            const binaryString = atob(Storage.GetItem(saveKey) ?? "");
            const view = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                view[i] = binaryString.charCodeAt(i);
            }
            return GameState.CreateModelFromData(view);
        } catch (er) {
            return null
        }
    }

    static CreateModelFromData(view: Uint8Array): GameModel {
        let offset = 0;
        const status = view[offset++];
        view[offset++] as EventType;
        // const events: Event[] = [{ type: eventType }]
        const difficulty = view[offset++];
        const mines = view[offset++];
        const cellsX = view[offset++];
        const cellsY = view[offset++];
        const cells: Record<string, Cell> = {};
        for (let x = 0; x < cellsX; x++) {
            for (let y = 0; y < cellsY; y++) {
                const bitField = view[offset++];
                const mined = Boolean(bitField & 0b1);
                const flagged = Boolean(bitField >> 1 & 0b1);
                const opened = Boolean(bitField >> 2 & 0b1);
                const nearbyMines = bitField >> 3;
                const cell = new Cell(mined, flagged, opened, nearbyMines);
                cells[String(x) + "," + String(y)] = cell;
            }
        }
        return new GameModel(status, difficulty, [], mines, new GameField(cells));
    }

}