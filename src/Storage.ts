import { DifficultyMines } from "./constants";
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

    private static ParseDifficulty(raw: string): Difficulty {
        const isCorrect = raw in DifficultyMines;
        return isCorrect ? raw as Difficulty : "medium";
    }

    static GetDifficulty(): Difficulty {
        const difficultyRaw = this.GetItem(difficultyKey) ?? ""
        return this.ParseDifficulty(difficultyRaw);
    }

    static SetDifficulty(raw: string) {
        this.SetItem(difficultyKey, this.ParseDifficulty(raw));
    }
}