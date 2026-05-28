import { type Reminder, type ReminderRow, rowToReminder } from '../types';

// ワークスペース全体のリマインダーを発火時刻順で取得する
export const listReminders = async (env: Env): Promise<Reminder[]> => {
  const { results } = await env.DB.prepare('SELECT * FROM reminders ORDER BY next_fire_at ASC').all<ReminderRow>();
  return results.map(rowToReminder);
};
