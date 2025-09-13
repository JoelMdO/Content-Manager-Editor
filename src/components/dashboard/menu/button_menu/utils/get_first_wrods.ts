function getFirstWords(text: string, wordCount: number = 100): string {
  const words = text.trim().split(/\s+/); // split on spaces/tabs/newlines
  return words.slice(0, wordCount).join(" ");
}
export default getFirstWords;
