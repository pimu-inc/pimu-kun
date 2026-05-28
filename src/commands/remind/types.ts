export type ReminderType = 'daily' | 'weekly' | 'monthly' | 'once';

export type Reminder = {
  id: string;
  type: ReminderType;
  hour: number;
  minute: number;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  date: string | null;
  message: string;
  channelId: string;
  channelName: string | null;
  createdBy: string;
  nextFireAt: number;
  createdAt: number;
};

// D1 の行スキーマ（snake_case）
export type ReminderRow = {
  id: string;
  type: string;
  hour: number;
  minute: number;
  day_of_week: number | null;
  day_of_month: number | null;
  date: string | null;
  message: string;
  channel_id: string;
  channel_name: string | null;
  created_by: string;
  next_fire_at: number;
  created_at: number;
};

export const rowToReminder = (row: ReminderRow): Reminder => ({
  id: row.id,
  type: row.type as ReminderType,
  hour: row.hour,
  minute: row.minute,
  dayOfWeek: row.day_of_week,
  dayOfMonth: row.day_of_month,
  date: row.date,
  message: row.message,
  channelId: row.channel_id,
  channelName: row.channel_name,
  createdBy: row.created_by,
  nextFireAt: row.next_fire_at,
  createdAt: row.created_at,
});

export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const;
