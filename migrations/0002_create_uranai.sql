-- 占い用プロフィール
CREATE TABLE IF NOT EXISTS uranai_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birthday TEXT NOT NULL,       -- 'YYYY-MM-DD'
  registered_by TEXT NOT NULL,  -- 登録したユーザーの Slack user_id
  created_at INTEGER NOT NULL   -- epoch ms (UTC)
);

-- 鑑定結果のキャッシュ(同じ人×同じ日は使い回す)
CREATE TABLE IF NOT EXISTS uranai_readings (
  profile_id TEXT NOT NULL,
  date TEXT NOT NULL,           -- 'YYYY-MM-DD' (JST)
  reading TEXT NOT NULL,
  created_at INTEGER NOT NULL,  -- epoch ms (UTC)
  PRIMARY KEY (profile_id, date)
);
