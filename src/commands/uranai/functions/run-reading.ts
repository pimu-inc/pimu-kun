import { postMessage, updateMessage } from '../../../slack/api';
import type { Block } from '../../../slack/types';
import { generateReading } from './generate-reading';
import { getProfile } from './profiles';

const readingBlocks = (title: string, reading: string): Block[] => [
  {
    type: 'header',
    text: { type: 'plain_text', text: title, emoji: true },
  },
  {
    type: 'section',
    text: { type: 'mrkdwn', text: reading },
  },
  {
    type: 'context',
    elements: [{ type: 'mrkdwn', text: '⚠️ 当鑑定はエンタメです。人生の決断はご自身で! ・ 結果は1日1回更新' }],
  },
];

// モーダル送信後に裏で走る。先に「鑑定中」を出し、生成できたら書き換える。
export const runReading = async (env: Env, channelId: string, profileId: string): Promise<void> => {
  const token = env.SLACK_BOT_TOKEN;

  const profile = await getProfile(env, profileId);
  if (!profile) {
    await postMessage(token, channelId, { text: '🔮 そのプロフィールが見つからなかったのよ。もう一度試しなさい。' });
    return;
  }

  const placeholder = await postMessage(token, channelId, {
    text: '🔮 姐さんが水晶玉を覗いています…',
  });

  try {
    const reading = await generateReading(env, profile);
    const title = `🔮 本日の鑑定: ${profile.name}`;
    const message = { text: title, blocks: readingBlocks(title, reading) };

    if (placeholder.ok && placeholder.ts) {
      await updateMessage(token, channelId, placeholder.ts, message);
    } else {
      await postMessage(token, channelId, message);
    }
  } catch {
    const failText = '🔮 水晶玉が曇っているわ…(鑑定に失敗しました。少し待ってからもう一度どうぞ)';
    if (placeholder.ok && placeholder.ts) {
      await updateMessage(token, channelId, placeholder.ts, { text: failText });
    } else {
      await postMessage(token, channelId, { text: failText });
    }
  }
};
