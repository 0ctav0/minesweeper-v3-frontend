
const soundEnabledKey = "soundEnabled";
const versionKey = "storage-version"
const version = "0.1";

export class Storage {
    static Init() {
        if (version !== Storage.GetItem(versionKey)) {
            localStorage.clear()
            Storage.SetItem(versionKey, version);
        }
    }
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
}

Storage.Init();