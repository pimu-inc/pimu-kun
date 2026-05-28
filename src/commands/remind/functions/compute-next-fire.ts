import type { ReminderType } from '../types';

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

type JstParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
};

// epoch ms -> JST の壁時計表現
const toJstParts = (epochMs: number): JstParts => {
  const d = new Date(epochMs + JST_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    weekday: d.getUTCDay(),
  };
};

// JST の壁時計 -> epoch ms（day の桁あふれは Date.UTC が翌月へ繰り上げる）
const jstToEpoch = (year: number, month: number, day: number, hour: number, minute: number): number =>
  Date.UTC(year, month - 1, day, hour, minute, 0, 0) - JST_OFFSET_MS;

const daysInMonth = (year: number, month: number): number => new Date(Date.UTC(year, month, 0)).getUTCDate();

export type NextFireInput = {
  type: ReminderType;
  hour: number;
  minute: number;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  date?: string | null;
};

/**
 * 次回発火時刻(epoch ms)を JST 基準で算出する。
 * daily/weekly/monthly は from より後の最初の発火時刻を返す。
 * once は指定日時の絶対値を返す（過去でも返すので呼び出し側で検証する）。
 * 算出不能な場合は null。
 */
export const computeNextFire = (input: NextFireInput, from: number = Date.now()): number | null => {
  const now = toJstParts(from);

  switch (input.type) {
    case 'daily': {
      const today = jstToEpoch(now.year, now.month, now.day, input.hour, input.minute);
      return today > from ? today : jstToEpoch(now.year, now.month, now.day + 1, input.hour, input.minute);
    }
    case 'weekly': {
      if (input.dayOfWeek == null) return null;
      const deltaDays = (input.dayOfWeek - now.weekday + 7) % 7;
      const candidate = jstToEpoch(now.year, now.month, now.day + deltaDays, input.hour, input.minute);
      return candidate > from
        ? candidate
        : jstToEpoch(now.year, now.month, now.day + deltaDays + 7, input.hour, input.minute);
    }
    case 'monthly': {
      if (input.dayOfMonth == null) return null;
      let year = now.year;
      let month = now.month;
      // dayOfMonth=0 は末日。指定日が存在しない月(31日 in 2月 等)はスキップして将来の発火を探す
      for (let i = 0; i < 48; i++) {
        const lastDay = daysInMonth(year, month);
        const day = input.dayOfMonth === 0 ? lastDay : input.dayOfMonth;
        if (day <= lastDay) {
          const candidate = jstToEpoch(year, month, day, input.hour, input.minute);
          if (candidate > from) return candidate;
        }
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }
      return null;
    }
    case 'once': {
      if (!input.date) return null;
      const [y, m, d] = input.date.split('-').map((v) => Number.parseInt(v, 10));
      if (!y || !m || !d) return null;
      return jstToEpoch(y, m, d, input.hour, input.minute);
    }
    default:
      return null;
  }
};
