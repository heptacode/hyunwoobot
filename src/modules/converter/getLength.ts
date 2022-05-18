export function getLength(length: number): string {
  const hours = Math.floor(length / 3600);
  const minutes = Math.floor((length - hours * 3600) / 60);
  const seconds = length % 60;
  if (hours > 0)
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
