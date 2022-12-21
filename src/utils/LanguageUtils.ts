export namespace LanguageUtils {
  export function makePossessive(text: string): string {
    return text + (text.endsWith('s') ? "'" : "'s");
  }
}