import { CLASS, DifficultyInputID, ID, StatusText } from "../constants";
import { GameController } from "../controller";
import { getById } from "../helpers";
import { Difficulty, GameStatus } from "../types";
import "./menu-popup.css"

const POPUP_DELAY = 2000;
type Param = { gameController: GameController, onPlay: () => void, onInfo: () => void }

export class MenuPopup {
    private controller: GameController
    private show = false;
    private timerId?: number;

    constructor(param: Param) {
        this.controller = param.gameController;
        this.SetDifficultyInput(this.controller.model.difficulty);
        getById(ID.playBtn).onclick = param.onPlay;
        getById(ID.infoBtn).onclick = param.onInfo;
    }

    private static ParseDifficulty(text: string): Difficulty {
        const entry = Object.entries(DifficultyInputID).find(([, inputID]) => inputID === text)
        return entry ? Number(entry[0]) as Difficulty : Difficulty.MEDIUM;
    }

    static GetDifficultyFromInput(): Difficulty {
        const radio = document.querySelector(`.difficulty input:checked`) as HTMLInputElement;
        return MenuPopup.ParseDifficulty(radio.id);
    }

    SetDifficultyInput(difficulty: Difficulty) {
        const radio = getById(DifficultyInputID[difficulty]) as HTMLInputElement;
        radio.checked = true;
    }

    ToggleShow(force?: boolean) {
        this.show = force === undefined ? !this.show : force;
        getById(ID.menuPopup).style.display = this.show ? "flex" : "none";
        this.SetStatus(this.controller.model.status);
        getById(ID.optionsBtn).classList.toggle(CLASS.disabled, this.show);
    }

    SetStatus(state: GameStatus) {
        getById(ID.status).innerText = StatusText[state];
    }

    RequestMenuOpen() {
        this.timerId = setTimeout(() =>
            this.ToggleShow(true), POPUP_DELAY);
    }

    PreventMenuOpen() {
        clearTimeout(this.timerId);
    }

}
