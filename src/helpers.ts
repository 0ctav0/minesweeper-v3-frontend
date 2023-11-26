export function random(min: number, maxExclusive: number) {
  let rand = min + Math.random() * (maxExclusive - min);
  return Math.floor(rand);
}

export function randomSlice() {
  return Math.random().toString().slice(2);
}
