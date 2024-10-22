export class Cell {
    mined: boolean;
    flagged: boolean;
    opened: boolean;
    nearbyMines: number;

    constructor(mined: boolean, flagged: boolean, opened: boolean, nearbyMines: number) {
        this.mined = mined;
        this.flagged = flagged;
        this.opened = opened;
        this.nearbyMines = nearbyMines;
    }

    static Create() {
        return new Cell(false, false, false, 0);
    }
}