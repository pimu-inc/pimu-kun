import { formatJSTDate } from '../../../functions/format-jst-date';
import { formatJSTTime } from '../../../functions/format-jst-time';
import { type Reminder, WEEKDAY_LABELS } from '../types';

const pad2 = (n: number): string => String(n).padStart(2, '0');

// スケジュールを「毎日 09:00」等の人間可読文字列にする
export const describeSchedule = (r: Reminder): string => {
  const time = `${pad2(r.hour)}:${pad2(r.minute)}`;
  switch (r.type) {
    case 'daily':
      return `毎日 ${time}`;
    case 'weekly':
      return `毎週 ${WEEKDAY_LABELS[r.dayOfWeek ?? 0]}曜 ${time}`;
    case 'monthly':
      return `毎月 ${r.dayOfMonth === 0 ? '末日' : `${r.dayOfMonth}日`} ${time}`;
    case 'once':
      return `${r.date} ${time}`;
    default:
      return time;
  }
};

// 次回発火時刻を JST 表記にする
export const describeNextFire = (r: Reminder): string => {
  const d = new Date(r.nextFireAt);
  return `${formatJSTDate(d)} ${formatJSTTime(d)}`;
};
