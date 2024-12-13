export enum GameStatus { START, IN_PROGRESS, PAUSE, DEFEAT, WIN };
export enum EventType { NONE, DEFEAT, WIN };
export type Event = { type: EventType.DEFEAT, x: number, y: number } | { type: EventType.WIN };

export enum Difficulty { EASY, MEDIUM, HARD, IMPOSSIBLE };

export type CallbackControlRes = void | "break" | "continue";