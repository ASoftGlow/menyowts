export class TimeFormatter {
  static parseMilliseconds(ms: number): string {
    let output = '';
    const s = ms % 1000;
    const m = s % 60;
    const h = m % 60;
    const d = h % 24;

    if (d > 0) {
      output += d + ' days';
    }
    else if (h > 0) {
      output += h + ' hours';
    }
    else if (m > 0) {
      output += m + ' minutes';
    }
    else {
      output += s + ' seconds';
    }
    return output;
  }
}