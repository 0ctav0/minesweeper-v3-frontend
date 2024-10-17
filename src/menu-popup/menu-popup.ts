import { CLASS, Difficulty, ID } from "../constants";
import { GameController } from "../controller";
import { getById } from "../helpers";
import "./menu-popup.css"

type Param = { gameController: GameController, onPlay: (controller: GameController, menu: MenuPopup) => void }

export class MenuPopup {
    private show = false;


    constructor(param: Param) {
        this.SetDifficultyInput(param.gameController.model.difficulty);
        getById(ID.playBtn).onclick = () => param.onPlay(param.gameController, this);
        getById(ID.easyVal).innerText = String(0);
        getById(ID.mediumVal).innerText = String(0);
        getById(ID.hardVal).innerText = String(0);
        getById(ID.impossibleVal).innerText = String(0);
    }

    SetDifficultyInput(difficulty: Difficulty) {
        const radio = document.querySelector(`[id="${difficulty}"]`) as HTMLInputElement;
        radio.checked = true;
    }

    ToggleShow() {
        this.show = !this.show;
        getById(ID.menuPopup).style.display = this.show ? "flex" : "none";
        getById(ID.optionsBtn).classList.toggle(CLASS.disabled);
    }

    GetDifficulty(): Difficulty {
        return "medium";
    }



}
