import type { Result } from '../../../types/result';
import type { Reminder, ReminderType } from '../types';
import { computeNextFire } from './compute-next-fire';

export type CreateReminderInput = {
  type: ReminderType;
  hour: number;
  minute: number;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  date?: string | null;
  message: string;
  channelId: string;
  channelName?: string | null;
  createdBy: string;
};

export const createReminder = async (env: Env, input: CreateReminderInput): Promise<Result<Reminder>> => {
  const nextFireAt = computeNextFire(input);
  if (nextFireAt == null) {
    return { success: false, message: 'スケジュールの解釈に失敗しました。入力を確認してください。' };
  }
  if (input.type === 'once' && nextFireAt <= Date.now()) {
    return { success: false, message: '過去の日時は指定できません。' };
  }

  const now = Date.now();
  const reminder: Reminder = {
    id: crypto.randomUUID(),
    type: input.type,
    hour: input.hour,
    minute: input.minute,
    dayOfWeek: input.dayOfWeek ?? null,
    dayOfMonth: input.dayOfMonth ?? null,
    date: input.date ?? null,
    message: input.message,
    channelId: input.channelId,
    channelName: input.channelName ?? null,
    createdBy: input.createdBy,
    nextFireAt,
    createdAt: now,
  };

  await env.DB.prepare(
    `INSERT INTO reminders
      (id, type, hour, minute, day_of_week, day_of_month, date, message, channel_id, channel_name, created_by, next_fire_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      reminder.id,
      reminder.type,
      reminder.hour,
      reminder.minute,
      reminder.dayOfWeek,
      reminder.dayOfMonth,
      reminder.date,
      reminder.message,
      reminder.channelId,
      reminder.channelName,
      reminder.createdBy,
      reminder.nextFireAt,
      reminder.createdAt
    )
    .run();

  return { success: true, data: reminder };
};
