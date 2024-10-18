import { DifficultyInputID } from "./constants";
import { Difficulty } from "./types";

const difficultyKey = "difficulty";
const soundEnabledKey = "soundEnabled";


export class Storage {

    static GetItem(key: string) {
        return localStorage.getItem(key)
    }

    static SetItem(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    static GetSoundEnabled(): boolean {
        return JSON.parse(Storage.GetItem(soundEnabledKey) ?? "false")
    }

    static SetSoundEnabled(soundEnabled: boolean) {
        Storage.SetItem(soundEnabledKey, String(soundEnabled))
    }

    // to as: 0, 1, ...
    private static ParseDifficulty(text: string): Difficulty {
        const entry = Object.entries(DifficultyInputID).find(([, inputID]) => inputID === text)
        return entry ? Number(entry[0]) as Difficulty : Difficulty.medium;
    }

    // get as: 0, 1, ...
    static GetDifficulty(): Difficulty {
        const difficultyRaw = this.GetItem(difficultyKey) ?? ""
        return this.ParseDifficulty(difficultyRaw);
    }

    // comes as: easy, medium, ...
    static SetDifficulty(text: string) {
        this.SetItem(difficultyKey, text);
    }
}