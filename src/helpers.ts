export function random(min: number, maxExclusive: number) {
  let rand = min + Math.random() * (maxExclusive - min);
  return Math.floor(rand);
}

export function randomSlice() {
  return Math.random().toString().slice(2);
}

export const range = (start: number, end: number) => [...Array(end - start).keys()].map(i => i + start)

export const getById = (id: string) => document.querySelector(`#${id}`) as HTMLElement;

export const getAllByName = (name: string) => document.querySelectorAll(`[name="${name}"]`) as NodeListOf<HTMLElement>;