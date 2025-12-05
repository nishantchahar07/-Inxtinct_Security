export function toSingleSentence(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
