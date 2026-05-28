import { postMessage } from '../../../slack/api';
import { type ReminderRow, rowToReminder } from '../types';
import { computeNextFire } from './compute-next-fire';

// 期限が到来したリマインダーを送信し、再帰分は次回時刻へ更新、単発は削除する。
// cron(毎分)から呼ばれる。遅延・欠落しても next_fire_at <= now で取りこぼさない。
export const runDueReminders = async (env: Env): Promise<void> => {
  const now = Date.now();
  const { results } = await env.DB.prepare('SELECT * FROM reminders WHERE next_fire_at <= ? ORDER BY next_fire_at ASC')
    .bind(now)
    .all<ReminderRow>();

  for (const row of results) {
    const reminder = rowToReminder(row);

    await postMessage(env.SLACK_BOT_TOKEN, reminder.channelId, {
      text: `:alarm_clock: リマインダー\n${reminder.message}`,
    });

    if (reminder.type === 'once') {
      await env.DB.prepare('DELETE FROM reminders WHERE id = ?').bind(reminder.id).run();
      continue;
    }

    const nextFireAt = computeNextFire(reminder, now);
    if (nextFireAt == null) {
      await env.DB.prepare('DELETE FROM reminders WHERE id = ?').bind(reminder.id).run();
      continue;
    }
    await env.DB.prepare('UPDATE reminders SET next_fire_at = ? WHERE id = ?').bind(nextFireAt, reminder.id).run();
  }
};
