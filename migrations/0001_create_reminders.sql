-- リマインダー保存テーブル
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,          -- 'daily' | 'weekly' | 'monthly' | 'once'
  hour INTEGER NOT NULL,       -- 0-23 (JST)
  minute INTEGER NOT NULL,     -- 0-59 (JST)
  day_of_week INTEGER,         -- 0(日)-6(土) weekly のみ
  day_of_month INTEGER,        -- 1-31, 0=末日 monthly のみ
  date TEXT,                   -- 'YYYY-MM-DD' (JST) once のみ
  message TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  channel_name TEXT,
  created_by TEXT NOT NULL,
  next_fire_at INTEGER NOT NULL, -- epoch ms (UTC)
  created_at INTEGER NOT NULL    -- epoch ms (UTC)
);

CREATE INDEX IF NOT EXISTS idx_reminders_next_fire ON reminders(next_fire_at);
