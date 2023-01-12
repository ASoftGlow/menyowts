import { CustomEmojis } from '../assets/Emojis.js';


export function progressBar(progress: number, goal: number, width: number): string {
  var filled = Math.round(progress / goal * width);
  var bar = `**${progress}** `;
  if (filled > 0) {
    bar += CustomEmojis.BarEmojis.bar1end1;
    if (filled === width) {
      bar += CustomEmojis.BarEmojis.bar1.repeat(width - 2) + CustomEmojis.BarEmojis.bar1end2;
    }
    else {
      bar += CustomEmojis.BarEmojis.bar1.repeat(filled - 1) + CustomEmojis.BarEmojis.bar0.repeat(width - filled - 1) + CustomEmojis.BarEmojis.bar0end2;
    }
  }
  else {
    bar += CustomEmojis.BarEmojis.bar0end1 + CustomEmojis.BarEmojis.bar0.repeat(width - 2) + CustomEmojis.BarEmojis.bar0end2;
  }

  return bar + `  **${goal}**`;
}

export function expBar(exp: number, level: number): string {
  return progressBar(exp, (level + 1) * 100, 10);
}