/**
 * DateオブジェクトをJSTのyyyy/mm/dd形式でフォーマットする
 * @param date - Dateオブジェクト
 * @returns yyyy/mm/dd形式の文字列
 */
export const formatJSTDate = (date: Date): string => {
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const year = jstDate.getUTCFullYear();
  const month = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(jstDate.getUTCDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};
