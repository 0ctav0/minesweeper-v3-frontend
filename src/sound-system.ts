import { CLASS, ID } from "./constants";
import { getById } from "./helpers";
import { Storage } from "./Storage";

export class SoundSystem {
    soundEnabled: boolean = false;

    constructor() {
        this.soundEnabled = Storage.GetSoundEnabled();
        this.InitSoundBtn();
    }

    InitSoundBtn() {
        getById(ID.soundBtn).onclick = () => {
            this.soundEnabled = !this.soundEnabled;
            this.UpdateSoundBtn();
        }
        this.UpdateSoundBtn();
    }

    private UpdateSoundBtn() {
        getById(ID.soundBtn).classList.toggle(CLASS.disabled, !this.soundEnabled);
        Storage.SetSoundEnabled(this.soundEnabled);
    }

    Play(sound: HTMLAudioElement) {
        if (this.soundEnabled) {
            sound.load();
            sound.play();
        }
    }
}