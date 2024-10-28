export function random(min: number, maxExclusive: number) {
  let rand = min + Math.random() * (maxExclusive - min);
  return Math.floor(rand);
}

export const randomSigned = () => Math.random() > 0.5 ? Math.random() : -Math.random();

export function randomSlice() {
  return Math.random().toString().slice(2);
}

export const range = (start: number, end: number) => [...Array(end - start).keys()].map(i => i + start)

export const getById = (id: string) => document.querySelector(`#${id}`) as HTMLElement;

export const getByName = (name: string) => document.querySelector(`[name="${name}"]`) as HTMLElement;

export const getAllByName = (name: string) => document.querySelectorAll(`[name="${name}"]`) as NodeListOf<HTMLElement>;

export const degToRad = (degree: number) => degree * Math.PI / 180;