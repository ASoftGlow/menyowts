import {randomElement} from '../utils/RandomElement.js'


export namespace Dialog {
  export function meow(): string {
    return randomElement(['Mreeow', 'mew', 'Meow', 'MEOW!', 'meow', 'MRREEOW!'])
  }
  export function curse(): string {
    return randomElement(['Fox dung!'])
  }
  export function brush(): string {
    return randomElement(['Stay out of my fur!'])
  }
}