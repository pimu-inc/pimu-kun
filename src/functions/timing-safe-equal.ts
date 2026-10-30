/**
 * 2つのバイト列を一定時間で比較する(署名比較のタイミング攻撃対策)
 * @param a - 比較対象のバイト列
 * @param b - 比較対象のバイト列
 * @returns 一致すれば true
 */
export const timingSafeEqual = (a: ArrayBuffer, b: ArrayBuffer): boolean => {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  const aView = new Uint8Array(a);
  const bView = new Uint8Array(b);
  let result = 0;
  for (let i = 0; i < aView.length; i++) {
    result |= (aView[i] ?? 0) ^ (bView[i] ?? 0);
  }
  return result === 0;
};
