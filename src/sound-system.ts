const soundEnabledKey = "soundEnabled";


export class SoundSystem {
    soundEnabled: boolean = false;

    constructor() {
        this.soundEnabled = JSON.parse(localStorage.getItem(soundEnabledKey) ?? "false");
        this.initSoundBtn();
    }

    private initSoundBtn() {
        const sound = document.querySelector("#sound") as HTMLElement;
        sound.onclick = () => {
            this.soundEnabled = !this.soundEnabled;
            this.updateSoundBtn();
        }
        this.updateSoundBtn();
    }

    private updateSoundBtn() {
        const sound = document.querySelector("#sound") as HTMLElement;
        sound.style.filter = `opacity(${this.soundEnabled ? 1 : 0.3})`;
        localStorage.setItem(soundEnabledKey, String(this.soundEnabled));
    }

    Play(sound: HTMLAudioElement) {
        if (this.soundEnabled) {
            sound.load();
            sound.play();
        }
    }
}