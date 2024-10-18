import { CLASS, DifficultyInputID, ID, NAME, StatusText } from "../constants";
import { GameController } from "../controller";
import { getById, getAllByName } from "../helpers";
import { Difficulty, GameStatus } from "../types";
import { Storage } from "../Storage";
import "./menu-popup.css"

const POPUP_DELAY = 2000;
type Param = { gameController: GameController, onPlay: () => void }

export class MenuPopup {
    private controller: GameController
    private show = false;
    private timerId?: number;

    constructor(param: Param) {
        this.controller = param.gameController;
        this.SetDifficultyInput(param.gameController.model.difficulty);
        this.InitOnClickDifficulty();
        getById(ID.playBtn).onclick = param.onPlay;
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

    private InitOnClickDifficulty() {
        getAllByName(NAME.difficulty).forEach((el) => el.onclick = (e) => {
            const radio = e.target as HTMLInputElement;
            Storage.SetDifficulty(radio.id);
        })
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
