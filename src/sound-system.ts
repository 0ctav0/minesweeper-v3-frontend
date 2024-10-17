import { CLASS, ID } from "./constants";
import { getById } from "./helpers";

const soundEnabledKey = "soundEnabled";


export class SoundSystem {
    soundEnabled: boolean = false;

    constructor() {
        this.soundEnabled = JSON.parse(localStorage.getItem(soundEnabledKey) ?? "false");
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
        localStorage.setItem(soundEnabledKey, String(this.soundEnabled));
    }

    Play(sound: HTMLAudioElement) {
        if (this.soundEnabled) {
            sound.load();
            sound.play();
        }
    }
}