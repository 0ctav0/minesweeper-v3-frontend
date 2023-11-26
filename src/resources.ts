import { CELL_SIZES } from "./consts";

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

export function loadImageResources(
  onLoadAllResources: (images: ImagesObject) => void
) {
  Promise.all(
    Object.keys(images).map((key) => {
      const image = images[key as ImageKeys];
      return new Promise((resolve) => (image.onload = image.onerror = resolve));
    })
  ).then((results) =>
    results.every((res) => {
      if (res) {
        onLoadAllResources(images);
      } else {
        throw new Error("some images didn't loaded successfully");
      }
    })
  );
}
