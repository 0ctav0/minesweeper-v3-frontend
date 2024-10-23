import "./info-popup.css";
import { ID } from "../constants";
import { getById } from "../helpers";
import { Storage } from "../Storage";

export class InfoPopup {
    private el: HTMLElement;
    private content: HTMLElement;
    private closeBtn: HTMLElement;
    private open: boolean;

    constructor() {
        this.open = false;
        this.el = getById(ID.infoPopup);
        this.content = document.querySelector(`#${ID.infoPopup} .content`) as HTMLElement;
        this.closeBtn = getById(ID.closeBtn)
        this.closeBtn.onclick = () => {
            this.Show(false);
            Storage.SetTutorialShowed();
        }
    }

    Show(open: boolean, text?: string[]) {
        this.open = open;
        this.el.style.display = this.open ? "flex" : "none";
        const nodes = text?.map((line) => {
            const p = document.createElement("p");
            p.innerText = line;
            return p as Node;
        })
        this.content.replaceChildren(...nodes ?? [])
    }
}