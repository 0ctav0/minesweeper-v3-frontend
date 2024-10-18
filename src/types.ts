export enum GameStatus { START, IN_PROGRESS, PAUSE, DEFEAT, WIN };
export enum EventType { NONE, DEFEAT, WIN }
export type Event = { type: EventType; payload?: any };

export enum Difficulty { EASY, MEDIUM, HARD, IMPOSSIBLE };
