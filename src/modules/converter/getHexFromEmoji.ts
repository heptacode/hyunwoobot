export function getHexFromEmoji(emoji: string): string {
  return emoji.codePointAt(0).toString(16);
}
