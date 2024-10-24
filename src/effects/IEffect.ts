export interface IEffect {
    Play: (turnOffAfter: number) => void;
    Stop: () => void;
    Draw: () => void;
}