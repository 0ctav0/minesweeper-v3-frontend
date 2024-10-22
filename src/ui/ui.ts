export function initInformationPanel(mines: number) {
    const panel = document.querySelector("#info-panel");
    if (!panel) throw new Error("info panel is not found");
    writeMinesLeft(0, mines);
}

export function writeMinesLeft(flags: number, mines: number) {
    const flagsText = document.querySelector("#flags");
    if (!flagsText) throw new Error("flag text is not found");
    flagsText.textContent = `${mines - flags}`;
}

export function getMinesFromInput() {
    const minesInput = document.querySelector("#mines-input");
    if (!minesInput || !(minesInput instanceof HTMLInputElement))
        throw new Error("mines input is not found");
    return parseInt(minesInput.value, 10);
}
