/**
 * DateオブジェクトをJSTのhh:mm形式でフォーマットする
 * @param date - Dateオブジェクト
 * @returns hh:mm形式の文字列
 */
export const formatJSTTime = (date: Date): string => {
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const hours = String(jstDate.getUTCHours()).padStart(2, '0');
  const minutes = String(jstDate.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};
