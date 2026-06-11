import { SYSTEM_PROMPT } from '../prompt';
import type { Profile } from '../types';

// JSTの 'YYYY-MM-DD'
export const todayJST = (): string => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

// Cloudflare Workers AI(プラン内無料枠)で生成する。外部APIキー不要。
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

const callWorkersAI = async (env: Env, profile: Profile): Promise<string> => {
  const result = await env.AI.run(MODEL, {
    max_tokens: 800,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `名前: ${profile.name}\n生年月日: ${profile.birthday}\n今日の日付: ${todayJST()}\nこの人の「今日の運勢」を鑑定してください。`,
      },
    ],
  });

  const reading = 'response' in result ? (result.response ?? '') : '';
  if (!reading.trim()) {
    throw new Error('Workers AI returned an empty response');
  }
  return reading.trim();
};

// 同じ人×同じ日はキャッシュを返す(コスト対策 + 「今日の運勢」としての一貫性)
export const generateReading = async (env: Env, profile: Profile): Promise<string> => {
  const date = todayJST();

  const cached = await env.DB.prepare('SELECT reading FROM uranai_readings WHERE profile_id = ? AND date = ?')
    .bind(profile.id, date)
    .first<{ reading: string }>();
  if (cached) {
    return cached.reading;
  }

  const reading = await callWorkersAI(env, profile);

  await env.DB.prepare(
    'INSERT OR REPLACE INTO uranai_readings (profile_id, date, reading, created_at) VALUES (?, ?, ?, ?)'
  )
    .bind(profile.id, date, reading, Date.now())
    .run();

  return reading;
};
