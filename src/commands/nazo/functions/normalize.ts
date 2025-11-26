export const katakanaToHiragana = (text: string): string => {
  return text.replace(/[\u30A1-\u30F6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60);
  });
};
