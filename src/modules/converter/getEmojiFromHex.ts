export function getEmojiFromHex(hex: string): string {
  return String.fromCodePoint(Number(`0x${hex}`));
}
