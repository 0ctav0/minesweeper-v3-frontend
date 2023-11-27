import { CELL_SIZES } from "./constants";

export const images = {
  cell: new Image(CELL_SIZES[0], CELL_SIZES[1]),
  selectedCell: new Image(CELL_SIZES[0], CELL_SIZES[1]),
  flag: new Image(CELL_SIZES[0], CELL_SIZES[1]),
  mine: new Image(CELL_SIZES[0], CELL_SIZES[1]),
};
images.cell.src = "/img/cell.svg";
images.selectedCell.src = "/img/selected-cell.svg";
images.flag.src = "/img/flag.svg";
images.mine.src = "/img/mine.svg";

export type ImagesObject = typeof images;
export type ImageKeys = keyof ImagesObject;

export const sounds = {
  death: new Audio("/sounds/pig-bomb.mp3"),
};

export type SoundsObject = typeof sounds;
export type SoundKeys = keyof SoundsObject;

export function loadResources(
  onLoadAllResources: (images: ImagesObject, sounds: SoundsObject) => void
) {
  Promise.all([
    Object.keys(images).map((key) => {
      const image = images[key as ImageKeys];
      return new Promise((resolve) => (image.onload = image.onerror = resolve));
    }),
    Object.keys(sounds).map((key) => {
      const sound = sounds[key as SoundKeys];
      return new Promise((resolve) => (sound.onload = sound.onerror = resolve));
    }),
  ]).then((results) =>
    results.every((res) => {
      if (res) {
        onLoadAllResources(images, sounds);
      } else {
        throw new Error("some resources didn't loaded successfully");
      }
    })
  );
}
