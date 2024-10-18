export type GameState = "START" | "IN_PROGRESS" | "PAUSE" | "DEFEAT" | "WIN";
export type Event = { type: "DEFEAT" | "WIN"; payload?: any };

export type Difficulty = "easy" | "medium" | "hard" | "impossible";
