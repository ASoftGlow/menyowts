// const rand = require('random-seed').create()

export function randomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)]
  // return array[rand.intBetween(0, array.length)];
};